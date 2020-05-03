const mongoose = require('mongoose');
let bookSchema = mongoose.Schema({
    title: String,
    author: Array,
    isbn: String
}, {
    collection: 'books'
});

module.exports = mongoose.model('Book', bookSchema);