const Joi = require('joi');
const { Day } = require('../../models/Day');

Joi.objectId = require('joi-objectid')(Joi);

const validate = params => {
  const schema = {
    dayId: Joi.objectId().required(),
  };

  return Joi.validate(params, schema);
};

/**
 * Gets report data
 *
 * endpoint ➜ GET /api/report
 */
const getReport = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const day = await Day.findOne({
    _id: req.body.dayId,
    belongsTo: req.userId,
  });
  if (!day) return res.status(404).json({ error: 'Day not found' });

  const tasks = day.sections.reduce((acc, section) => {
    const { tasks, _id: sectionId } = section;
    return [
      ...acc,
      ...tasks.map(({ _id: id, name, time, scopeId, completed }) => ({
        id,
        name,
        time,
        completed,
        scopeId,
        sectionId,
      })),
    ];
  }, []);
  const totalTime = tasks.reduce((acc, { time }) => acc + time, 0);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;

  res.json({
    dayId: day._id,
    day: day.day,
    totalTime,
    totalTasks,
    completedTasks,
    tasks,
  });
};

module.exports = getReport;
