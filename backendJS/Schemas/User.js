const mongoose = require('mongoose');
let userSchema = mongoose.Schema({
    name: String,
    username: String,
    email: String
}, {
    collection: 'users'
});

module.exports = mongoose.model('User', userSchema);