const { Day } = require('../models/Day');
const { Task, validate } = require('../models/Task');

/**
 * Creates a new task
 *
 * endpoint ➜ POST /api/tasks
 */
exports.createTask = async (req, res) => {
  const { error } = validate(req.body.payload);
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
  if (!day) return res.status(404).json({ error: 'Day not found' });

  const section = day.sections.id(sectionId);
  if (!section) return res.status(404).json({ error: 'Section not found' });

  res.json(section.tasks);
};

/**
 * Updates a task
 *
 * endpoint ➜ PUT /api/tasks/:id
 */
exports.updateTask = async (req, res) => {
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

  const task = section.tasks.id(req.params.id);
  task.set(payload);

  await day.save();
  res.json({ message: '🥑' });
};
