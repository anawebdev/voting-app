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
    creator_id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    timestamp: {
        type: String
    },
    options: [optionSchema],

})

const PollInfo = module.exports = mongoose.model('Polls', pollSchema, 'polls')