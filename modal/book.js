const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newBook = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },

    language: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    file: {
        type: String,
        required: true
    },


});

const Book = mongoose.model('Book', newBook);
module.exports = Book;