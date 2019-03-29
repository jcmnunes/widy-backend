const { User, validate } = require('../models/User');
const bcrypt = require('bcrypt');
const _ = require('lodash');

/**
 * Register a new user.
 *
 * endpoint ➜ POST /api/users
 */
exports.registerUser = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  user.generateAuthToken(res);
  res.send(_.pick(user, ['_id', 'name', 'email']));
};

/**
 * Gets the current logged in user data
 *
 * endpoint ➜ GET /api/users/me
 */
exports.getMe = async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  res.send(user);
};
