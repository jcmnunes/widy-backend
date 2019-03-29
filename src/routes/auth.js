const router = require('express').Router();
const catchErrors = require('../middlewares/catchErrors');
const authController = require('../controllers/auth');
const requireLogin = require('../middlewares/requireLogin');

router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/check', requireLogin, authController.check);
router.post('/forgot', catchErrors(authController.forgot));
router.post('/reset', authController.confirmPasswords, catchErrors(authController.reset));

module.exports = router;
