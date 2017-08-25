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
    polls: [pollSchema]
})

const UserInfo = module.exports = mongoose.model('User', userSchema, 'users')