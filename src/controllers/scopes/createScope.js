const Joi = require('joi');
const { User } = require('../../models/User');
const { Scope } = require('../../models/Scope');

const validate = body => {
  const schema = {
    name: Joi.string().required(),
    shortCode: Joi.string().required(),
  };

  return Joi.validate(body, schema);
};

/**
 * Creates a new scope
 *
 * endpoint ➜ POST /api/scopes
 */
const createScope = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const {
    body: { name, shortCode },
    userId,
  } = req;

  const user = await User.findById(userId);
  const { scopes, archivedScopes } = user;

  for (const scope of scopes) {
    if (name.toLowerCase().trim() === scope.name.toLowerCase()) {
      return res.status(400).json({ message: 'Scope name exists.' });
    }
    if (shortCode.toLowerCase().trim() === scope.shortCode.toLowerCase()) {
      return res.status(400).json({ message: 'Scope code exists.' });
    }
  }

  for (const archivedScope of archivedScopes) {
    if (archivedScope.name.toLowerCase().trim() === name.toLowerCase()) {
      return res.status(400).json({ message: 'Scope name exists and is archived.' });
    }
    if (archivedScope.shortCode.toLowerCase().trim() === shortCode.toLowerCase()) {
      return res.status(400).json({ message: 'Scope code exists and is archived.' });
    }
  }

  const newScope = new Scope({ name, shortCode });
  user.scopes.unshift(newScope);
  await user.save();

  res.json(newScope);
};

module.exports = createScope;
