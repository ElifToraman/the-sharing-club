const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: { type: String, required: true},
    users: {
        type:
            [{
            type: Schema.ObjectId,
            ref: 'User'
            }]
    }
});

module.exports = mongoose.model('Group', groupSchema);
