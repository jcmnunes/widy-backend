const { Day } = require('../../models/Day');

/**
 * Gets a list of days
 *
 * endpoint ➜ GET /api/days
 */
const getDays = async (req, res) => {
  const days = await Day.find({ belongsTo: req.userId })
    .select('day')
    .sort({ day: 'desc' });
  res.json(days);
};

module.exports = getDays;
