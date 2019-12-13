const Joi = require('joi');
const { User } = require('../../models/User');

Joi.objectId = require('joi-objectid')(Joi);

const validate = body => {
  const schema = {
    id: Joi.objectId().required(),
    payload: Joi.object({
      name: Joi.string().required(),
      shortCode: Joi.string().required(),
    }).required(),
  };

  return Joi.validate(body, schema);
};

/**
 * Updates a scope
 *
 * endpoint ➜ PUT /api/scopes
 */
const updateScope = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const {
    body: { id, payload },
    userId,
  } = req;

  const user = await User.findById(userId);

  const scope = user.scopes.id(id);
  scope.set(payload);

  await user.save();
  res.json({ message: '🥑' });
};

module.exports = updateScope;
