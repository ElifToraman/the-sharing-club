const express = require('express');
const {check} = require('express-validator');
const tasksControllers = require('../controllers/tasks-controllers');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('/:tid', tasksControllers.getTaskById);

router.use(checkAuth);

router.post('/',
    [
        check('title')
        .not()
        .isEmpty(),
        check('description').isLength({min: 5}),
        check('score')
            .not()
            .isEmpty(),
        check('groupId')
            .not()
            .isEmpty()
    ],
        tasksControllers.createTask
);

router.patch('/:tid',
    [
        check('title')
            .not()
            .isEmpty(),
        check('description').isLength({min: 5}),
    ],
    tasksControllers.updateTask
);

router.delete('/:tid',tasksControllers.deleteTask);

router.put('/:tid/complete', tasksControllers.completeTask);

module.exports = router;