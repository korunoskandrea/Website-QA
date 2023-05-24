const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    approved: {
        type: Boolean,
        required: true,
        default: false
    },
    upvote: {
        type: Number,
        default: 0
    },
    downvote: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    text: {
        type: String,
        required: true
    },
    comments: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Comment"
        }
    ]
}, {timestamps: true});

const Answer = mongoose.model('Answer', AnswerSchema);

module.exports = Answer;