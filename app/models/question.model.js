const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    answers: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Answer"
        }
    ],
    views: [
        {
            type: mongoose.Types.ObjectId,
            ref: "View"
        }
    ],
    labels: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Label"
        }
    ],
}, {timestamps: true});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;