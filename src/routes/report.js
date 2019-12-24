const router = require('express').Router();
const reportController = require('../controllers/report');
const catchErrors = require('../middlewares/catchErrors');
const requireLogin = require('../middlewares/requireLogin');

router.get('/', requireLogin, catchErrors(reportController.getReport));

module.exports = router;
