const {validationResult} = require('express-validator');

const HttpError = require("../models/http-error");
const Task = require('../models/task');
const User = require('../models/user');
const mongoose = require("mongoose");

const getTaskById = async (req, res, next) => {
    const taskId = req.params.tid;

    let task;
    try {
        task = await Task.findById(taskId)
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a task.', 500);
        return next(error);
    }

    if (!task) {
        const error = new HttpError('Could not find a task for the provided id.', 404);
        return next(error);
    }


    res.json({task: task.toObject({getters: true})});
};

const createTask = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const {title, description, score, groupId} = req.body;

    const createdTask = new Task({
        title,
        description,
        score,
        groupId,
        creator: req.userData.userId
    });

    let user;
    try {
        user = await User.findById(req.userData.userId);
    } catch (err) {
        const error = new HttpError('Creating task failed, please try again.', 500);
        return next(error);
    }

    if (!user) {
        const error = new HttpError('Could not find user for provided id', 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdTask.save({session: sess});
        await user.save({session: sess});
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('Creating task failed, please try again.', 500);
        return next(error);
    }
    res.status(201).json({task: createdTask});
};

const updateTask = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const {title, description} = req.body;
    const taskId = req.params.tid;

    let task;
    try {
        task = await Task.findById(taskId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update task', 500);
        return next(error);
    }

    if (task.creator.toString() !== req.userData.userId) {
        const error = new HttpError('You are not allowed to edit this task.', 401);
        return next(error);
    }

    task.title = title;
    task.description = description;

    try {
        await task.save();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update task', 500);
        return next(error);
    }
    res.status(200).json({task: task.toObject({getters: true})});
};

const deleteTask = async (req, res, next) => {
    const taskId = req.params.tid;

    let task;
    try {
        task = await Task.findById(taskId).populate('creator');
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete task.', 500);
        return next(error);
    }

    if (!task) {
        const error = new HttpError('Could not find task for this id', 404);
        return next(error);
    }

    if (task.creator.id !== req.userData.userId) {
        const error = new HttpError('You are not allowed to delete this task.', 401);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await task.remove({session: sess});
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete task.', 500);
        return next(error);
    }

    res.status(200).json({message: 'Deleted task.'});
};
const completeTask = async (req, res, next) => {
    const taskId = req.params.tid;

    let completedTask;
    try {
        completedTask = await Task.findById(taskId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a task.', 500);
        return next(error);
    }

    if (!completedTask) {
        const error = new HttpError('Could not find a task for the provided id.', 404);
        return next(error);
    }
    ;

    if (completedTask.isCompleted) {
        res.status(200).json({task: completedTask.toObject({getters: true})});
        return
    }
    completedTask.isCompleted = true

    let user;
    try {
        user = await User.findById(req.userData.userId);
    } catch (err) {
        const error = new HttpError('Creating task failed, please try again.', 500);
        return next(error);
    }

    if (!user) {
        const error = new HttpError('Could not find user for provided id', 404);
        return next(error);
    }

    let userGroupScore = user.scores.find((score) => score.groupId === completedTask.groupId.toString())
    if (!userGroupScore) {
        user.scores.push({
            groupId: completedTask.groupId.toString(),
            score: completedTask.score
        })
    } else {
        userGroupScore.score += completedTask.score
    }


    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await completedTask.save({session: sess});
        await user.save({session: sess});
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update task', 500);
        return next(error);
    }
    res.status(200).json({task: completedTask.toObject({getters: true})});
}

exports.getTaskById = getTaskById;
exports.createTask = createTask;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask;
exports.completeTask = completeTask;