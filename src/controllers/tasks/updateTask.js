const Joi = require('joi');
const { Day } = require('../../models/Day');
const { Task } = require('../../models/Task');

Joi.objectId = require('joi-objectid')(Joi);

const validate = body => {
  const schema = {
    dayId: Joi.objectId().required(),
    sectionId: Joi.objectId().required(),
    payload: Joi.object().required(),
  };

  return Joi.validate(body, schema);
};

/**
 * Updates a task
 *
 * endpoint ➜ POST /api/tasks
 */
const updateTask = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const {
    body: { dayId, sectionId, payload },
    userId,
  } = req;

  const day = await Day.findOne({
    _id: dayId,
    belongsTo: userId,
  });
  if (!day) return res.status(404).json({ error: 'Day not found' });

  const section = day.sections.id(sectionId);
  if (!section) return res.status(404).json({ error: 'Section not found' });

  const task = new Task(payload);
  section.tasks.push(task);
  await day.save();
  res.json({ task });
};

module.exports = updateTask;
