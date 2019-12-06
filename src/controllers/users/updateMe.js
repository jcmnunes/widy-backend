const { User } = require('../../models/User');
const Joi = require('joi');

const validate = body => {
  const schema = {
    firstName: Joi.string()
      .min(1)
      .max(255)
      .required(),
    lastName: Joi.string()
      .min(1)
      .max(255)
      .required(),
  };

  return Joi.validate(body, schema);
};

/**
 * Updates the current logged user data
 *
 * endpoint ➜ PUT /api/users/me
 */
const updateMe = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { firstName, lastName } = req.body;

  const user = await User.findById(req.userId);

  user.firstName = firstName;
  user.lastName = lastName;

  await user.save();
  res.json({ message: '🥑🥥' });
};

module.exports = updateMe;
