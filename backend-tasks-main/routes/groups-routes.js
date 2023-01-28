const express = require('express');
const {check} = require('express-validator');

const groupsController = require('../controllers/groups-controllers');
const checkAuth = require("../middleware/check-auth");


const router = express.Router();

router.use(checkAuth);

router.get('/all', groupsController.getGroups);

router.get('/:groupId', groupsController.getGroupDetails);

router.get('/user/:uid', groupsController.getUserGroups);

router.post('/',
    [
        check('name')
            .not()
            .isEmpty()
    ],
    groupsController.createGroup
);
router.post('/user', [
        check('groupId')
            .not()
            .isEmpty()
        ],
    groupsController.addUserToGroup)

module.exports = router;