const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: { type: String, required: true},
    description: { type: String, required: true},
    score: {type: Number, required:true},
    isCompleted: {type: Boolean, required: false, default:false},
    creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User'},
    groupId: { type: mongoose.Types.ObjectId, required: true, ref: 'Group'}
});

module.exports = mongoose.model('Task', taskSchema);
