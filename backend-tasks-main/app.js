const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const tasksRoutes = require('./routes/tasks-routes');
const usersRoutes = require('./routes/users-routes');
const groupsRoutes = require('./routes/groups-routes');

const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    next();
});

app.use('/api/tasks',tasksRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/groups', groupsRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

app.use((error, req, res, next) => {
    if(req.file) {
        fs.unlink(req.file.path, err => {
            console.log(err);
        });
    }
    if(res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occurred!'});
});

mongoose
    .connect(`mongodb+srv://elif:EzPqHpzlt902d5Oc@cluster0.vlan119.mongodb.net/mern?retryWrites=true&w=majority`)
    .then(()=> {
        app.listen(5000);
    })
    .catch(err => {
        console.log(err);
    });

