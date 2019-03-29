const Joi = require('joi');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mail = require('../services/mail');
const { User } = require('../models/User');

const validateLoginData = req => {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
  };

  return Joi.validate(req, schema);
};

exports.login = async (req, res) => {
  const { error } = validateLoginData(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  user.generateAuthToken(res);
  res.end();
};

exports.logout = (req, res) => {
  res.clearCookie(process.env.COOKIE_KEY);
  res.json({ message: '🥑' });
};

exports.check = (req, res) => {
  if (req.userId) {
    return res.end();
  }
};

exports.forgot = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/reset/${user.resetPasswordToken}`;
    await mail.send({
      user,
      subject: 'Password reset',
      resetURL,
      filename: 'password-reset',
    });
  }
  return res.status(200).json();
};

exports.confirmPasswords = (req, res, next) => {
  if (req.body.password === req.body.confirm) {
    next();
  }
};

const validateResetData = req => {
  const schema = {
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
    confirm: Joi.string()
      .min(5)
      .max(255)
      .required(),
    token: Joi.string().allow(''),
  };

  return Joi.validate(req, schema);
};

exports.reset = async (req, res) => {
  const { error } = validateResetData(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const user = await User.findOne({
    resetPasswordToken: req.body.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user)
    return res.status(400).json({ message: 'Password reset token is invalid or has expired' });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  user.generateAuthToken(res);
  res.json({ message: '🥑' });
};
