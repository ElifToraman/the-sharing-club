const mongoose = require('mongoose');
const uniqueValidator= require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minLength: 6},
    image: {type: String, required: true},
    scores: {
        type:
            [{
            groupId: {type: String},
            score: {type: Number, default: 0}
            }]
    }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);