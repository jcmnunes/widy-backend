const { Day } = require('../models/Day');
const { Task } = require('../models/Task');

/**
 * Creates a new task
 *
 * endpoint ➜ POST /api/tasks
 */
exports.createTask = async (req, res) => {
  const {
    body: { dayId, sectionId, title },
    userId,
  } = req;

  const day = await Day.findOne({
    _id: dayId,
    belongsTo: userId,
  });
  if (!day) return res.status(404).json({ message: 'Day not found' });

  const section = day.sections.id(sectionId);
  if (!section) return res.status(404).json({ message: 'Section not found' });

  const task = new Task({ title });
  section.tasks.push(task);
  await day.save();
  res.json({ task });
};

/**
 * Gets list of tasks
 *
 * endpoint ➜ GET /api/tasks
 */
exports.getTasks = async (req, res) => {
  const {
    body: { dayId, sectionId },
    userId,
  } = req;

  const day = await Day.findOne({
    _id: dayId,
    belongsTo: userId,
  });
  if (!day) return res.status(404).json({ message: 'Day not found' });

  const section = day.sections.id(sectionId);
  if (!section) return res.status(404).json({ message: 'Section not found' });

  res.json(section.tasks);
};

/**
 * Updates a task
 *
 * endpoint ➜ PUT /api/tasks/:id
 */
exports.patchTask = async (req, res) => {};
