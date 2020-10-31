const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newUser = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },



});

const User = mongoose.model('User', newUser);
module.exports = User;