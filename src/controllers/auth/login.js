const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../../models/User');

const validate = body => {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .email()
      .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
  };

  return Joi.validate(body, schema);
};

/**
 * Logs the user into the app
 *
 * endpoint ➜ POST /api/auth/login
 */
const login = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email }).select(
    '-resetPasswordToken -resetPasswordExpires -__v',
  );
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  user.generateAuthToken(res);
  res.send(_.omit(user, ['password']));
};

module.exports = login;
