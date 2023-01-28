const HttpError = require("../models/http-error");

const mongoose = require("mongoose");
const {validationResult} = require("express-validator");

const Group = require('../models/group');
const User = require("../models/user");
const Task = require("../models/task");

const getGroups = async (req, res, next) => {
    let groups;

    try {
        groups = await Group.find();
    } catch (err) {
        const error = new HttpError('Fetching groups failed, please try again later.', 500);
        return next(error);
    }
    res.json({groups: groups.map(group => group.toObject({getters: true}))});
};

const getUserGroups = async (req, res, next) => {
    const userId = req.userData.userId;
    const objId = mongoose.Types.ObjectId(userId);

    let userGroups;
    try {
        userGroups = await Group.find({'users': objId});
    } catch (err) {
        const error = new HttpError('Fetching groups failed, please try again later.', 500);
        return next(error);
    }
    if (!userGroups || userGroups.length === 0) {
        return next(
            new HttpError('Could not find groups for the provided user id.', 404)
        );
    }


    res.json({groups: userGroups.map(group => group.toObject({getters: true}))});
};

const createGroup = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const {name} = req.body;

    const createdGroup = new Group({
        name
    });

    let user;

    try {
        user = await User.findById(req.userData.userId);
    } catch (err) {
        const error = new HttpError('Creating group failed, please try again.', 500);
        return next(error);
    }

    if (!user) {
        const error = new HttpError('Could not find user for provided id', 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        createdGroup.users.push(user);
        await createdGroup.save({session: sess});
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('Creating group failed, please try again.', 500);
        return next(error);
    }
    res.status(201).json({group: createdGroup});
};

const getGroupDetails = async (req, res, next) => {
    const groupId = req.params.groupId
    let group;

    try {
        group = await Group.findById(groupId);
    } catch (err) {
        const error = new HttpError('Getting the group failed, please try again.', 500);
        return next(error);
    }

    if (!group) {
        const error = new HttpError('Could not find group for provided id', 404);
        return next(error);
    }
    let groupTasks;

    try {
        groupTasks = await Task.find({'groupId': mongoose.Types.ObjectId(groupId)})
    } catch (err) {
        const error = new HttpError('getting the tasks group failed, please try again.', 500);
        return next(error);
    }

    let groupUsers;
    try {
        groupUsers = await User.find(
            {
                '_id': {
                    $in: group.users.map(userId => mongoose.Types.ObjectId(userId))
                }
            }, '-password');
    } catch (err) {
        const error = new HttpError('Fetching users failed, please try again later.', 500);
        return next(error);
    }

    res.status(200).json({
        group: group,
        tasks: groupTasks.map(task => task.toObject({getters: true})),
        users: groupUsers.map(user => user.toObject({getters: true}))
    });

}

const addUserToGroup = async (req, res, next) => {
    let authUser;

    try {
        authUser = await User.findById(req.userData.userId);
    } catch (err) {
        const error = new HttpError('Creating group failed, please try again.', 500);
        return next(error);
    }

    if (!authUser) {
        const error = new HttpError('Could not find user for provided id', 404);
        return next(error);
    }
    let group;

    try {
        group = await Group.findById(req.body.groupId);
    } catch (err) {
        const error = new HttpError('Creating group failed, please try again.', 500);
        return next(error);
    }

    if (!group) {
        const error = new HttpError('Could not find group for provided id', 404);
        return next(error);
    }

    if (group.users.find((user) => user.toString() === authUser.id.toString())) {
        res.status(200).json({group: group});
        return;
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        group.users.push(authUser);
        await group.save({session: sess});
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('Creating group failed, please try again.', 500);
        return next(error);
    }
    res.status(200).json({group: group});

}
exports.getGroups = getGroups;
exports.getUserGroups = getUserGroups;
exports.createGroup = createGroup;
exports.addUserToGroup = addUserToGroup;
exports.getGroupDetails = getGroupDetails;