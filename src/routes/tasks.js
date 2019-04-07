const router = require('express').Router();
const catchErrors = require('../middlewares/catchErrors');
const tasksController = require('../controllers/tasks');
const requireLogin = require('../middlewares/requireLogin');

router.post('/', requireLogin, catchErrors(tasksController.createTask));
router.get('/', requireLogin, catchErrors(tasksController.getTasks));
router.put('/:id', requireLogin, catchErrors(tasksController.updateTask));

module.exports = router;
