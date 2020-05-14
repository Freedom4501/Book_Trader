const mongoose = require('mongoose');
let bookSchema = mongoose.Schema({
    title: String,
    author: Array,
    isbn: String,
    price: Number
}, {
    collection: 'books'
});

module.exports = mongoose.model('Book', bookSchema);