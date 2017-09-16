const mongoose = require('mongoose')


// Schema
const optionSchema = mongoose.Schema({
    option: {
        type: String
    },
    votes: {
        type: Number
    }
})

// Poll Schema
const pollSchema = mongoose.Schema({
    timestamp: {
        type: String
    },
    creator: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    options: [optionSchema],

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
        type: String
    },
    polls: [pollSchema]
})

const UserInfo = module.exports = mongoose.model('Users', userSchema, 'users')