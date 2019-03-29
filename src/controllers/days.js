const moment = require('moment');
const { Day, validate } = require('../models/Day');
const { Section } = require('../models/Section');

/**
 * Gets the list of days
 *
 * endpoint ➜ GET /api/days
 */
exports.getAllDays = async (req, res) => {
  const days = await Day.find({ belongsTo: req.userId })
    .select('day')
    .sort({ day: 'desc' });
  res.send(days);
};

/**
 * Creates a new day
 *
 * endpoint ➜ GET /api/days
 */
exports.createDay = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const dayISO = req.body.day;
  const formatedDay = moment(dayISO).format('YYYY-MM-DD');
  const existingDaysArray = await Day.find({ day: formatedDay, belongsTo: req.userId });
  if (existingDaysArray.length > 0) {
    return res.status(400).json({ message: 'Day exists' });
  }
  const day = new Day({
    day: moment(dayISO).format('YYYY-MM-DD'),
    sections: [
      new Section({
        title: 'Plan',
        tasks: [],
      }),
      new Section({
        title: 'In the morning',
        tasks: [],
      }),
      new Section({
        title: 'In the afternoon',
        tasks: [],
      }),
    ],
    belongsTo: req.userId,
  });
  const { _id, day: savedDay } = await day.save();
  res.json({ day: { _id, day: savedDay }, message: '🥑' });
};

/**
 * Gets a day by Id
 *
 * endpoint ➜ GET /api/days/:id
 */
exports.getDay = async (req, res) => {
  const day = await Day.findOne({
    _id: req.params.id,
    belongsTo: req.userId,
  });
  res.send(day);
};
