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
    date: {
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

const PollInfo = module.exports = mongoose.model('Poll', pollSchema, 'polls')