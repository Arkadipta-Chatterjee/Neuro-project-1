const mongoose = require('mongoose')
const Schema = mongoose.Schema

const QuestionsSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },

    voteCount: {
        type: Number
    },
    votes: [{
        user: { type: Schema.Types.ObjectId }
    }],

    views: [{
        user: { type: Schema.Types.ObjectId }
    }],
    answers: [{
        user: { type: Schema.Types.ObjectId },
        answer: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    date: {
        type: Date,
        default: Date.now
    }

})

module.exports = Question = mongoose.model('questionsModel', QuestionsSchema)
