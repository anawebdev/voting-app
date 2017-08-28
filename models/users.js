const mongoose = require('mongoose')

// Polls Schema
const pollSchema = mongoose.Schema({
    title: {
        type: String
    },
    date: {
        type: String
    }
})

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
        type: String,
        required: true
    },
    polls: [pollSchema]
})

const UserInfo = module.exports = mongoose.model('Users', userSchema, 'users')