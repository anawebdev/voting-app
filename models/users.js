const mongoose = require('mongoose')



// User Schema
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    }
})

const UserInfo = module.exports = mongoose.model('Users', userSchema, 'users')