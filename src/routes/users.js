const router = require('express').Router();
const catchErrors = require('../middlewares/catchErrors');
const userController = require('../controllers/users');
const requireLogin = require('../middlewares/requireLogin');

router.post('/', catchErrors(userController.registerUser));
router.get('/me', requireLogin, catchErrors(userController.getMe));

module.exports = router;
