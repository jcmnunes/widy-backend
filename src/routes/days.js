const router = require('express').Router();
const catchErrors = require('../middlewares/catchErrors');
const daysController = require('../controllers/days');
const requireLogin = require('../middlewares/requireLogin');

router.get('/', requireLogin, catchErrors(daysController.getAllDays));
router.get('/:id', requireLogin, catchErrors(daysController.getDay));
router.post('/', requireLogin, catchErrors(daysController.createDay));

module.exports = router;
