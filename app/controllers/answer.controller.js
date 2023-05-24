const Answer = require('../models/answer.model')
const Question = require('../models/question.model')
const Comment = require('../models/comment.model')

exports.createAnswer = async (req, res, next) => {
    try {
        let answer = await Answer.create({
            user: req.user.userId,
            text: req.body.text
        })
        answer = await answer.populate("user");
        const question = await Question.updateOne(
            {_id: req.params.id},
            {$push: {answers: answer._id}}
        )
        res.status(201).json({
            answer: answer
        })
    } catch (ex) {
        console.log(ex)
        res.status(500).json({
            error: "There was an error creating answer"
        })
    }
}

exports.deleteAnswer = async (req, res, next) => {
    const idAnswer = req.params.id;
    let answer = await Answer.deleteOne({
        _id: idAnswer
    });
    res.status(200).json({
        message: 'Delete successfully'
    })
}

exports.selectAnswer = async (req, res, next) => {
    const idAnswer = req.params.id;
    let answer = await Answer.updateOne({
        _id: idAnswer
    }, {
        approved: req.body.approved
    });
    res.status(200).json({
        message: 'Update successfully'
    })
}

exports.vote = async (req, res, next) => {
    const idAnswer = req.params.id;
    if (req.body.amount > 0) {
        let answer = await Answer.updateOne({
            _id: idAnswer
        }, {
            upvote: req.body.fullAmount
        });
    } else {
        let answer = await Answer.updateOne({
            _id: idAnswer
        }, {
            downvote: req.body.fullAmount
        });
    }
    res.status(200).json({
        message: 'Update successfully'
    })
}

exports.listAnswers = async (req, res, next) => {
    const answerList = await Answer.find({
        answer: req.answer
    }).sort({createdAt: -1});
    res.status(200).json({
        message: 'List answers successfully'

    })
}

exports.createComment = async (req, res, next) => {
    try {
        let comment = await Comment.create({
            user: req.user.userId,
            text: req.body.text
        })
        comment = await comment.populate("user");
        const answer = await Answer.updateOne(
            {_id: req.params.id},
            {$push: {answers: answer._id}}
        )
        res.status(201).json({
            comment: comment
        })
    } catch (ex) {
        console.log(ex)
        res.status(500).json({
            error: "There was an error creating answer"
        })
    }
}
exports.listComments = async (req, res, next) => {
    const question = await Question.findById(req.params.idQuestion).populate('answers').populate({
        path: 'answers',
        populate: ['user', 'comments']
    }).populate({
        path: 'answers',
        populate: {
            path: 'comments',
            populate: 'user'
        }
    });
    const answer = question.answers.find(answer => answer._id == req.params.idAnswer)
    if (answer) {
        res.render('comments', {
            comments: answer.comments,
            question: question,
            answers: answers
        })
    } else {
        res.status(500).json({
            message: 'Unable to fetch comments',
        })
    }

}