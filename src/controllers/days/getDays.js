const { Day } = require('../../models/Day');

/**
 * Gets a day by Id
 *
 * endpoint ➜ GET /api/days/:id
 */
const getDays = async (req, res) => {
  const days = await Day.find({ belongsTo: req.userId })
    .select('day')
    .sort({ day: 'desc' });
  res.send(days);
};

module.exports = getDays;
