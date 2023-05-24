const Question = require('../models/question.model')
const View = require('../models/view.models')
const jwt = require('jsonwebtoken')

exports.listQuestions = async (req, res, next) => {
    const questionList = await Question.find().populate(['user', 'labels', 'answers']).populate({
        path: 'answers',
        populate: 'user'
    }).sort({createdAt: -1});
    questionList.forEach(question => {
        question.answers.sort((a1, a2) => a2.createdAt - a1.createdAt)
    });
    res.render('question_list', {
        title: "What are you looking for?",
        questions: questionList,

    })
}


exports.hotQuestions = async (req, res, next) => {
    const questionList = await Question.find().populate(['user', 'labels', 'answers']).populate({
        path: 'answers',
        populate: 'user'
    }).populate(['user', 'labels', 'answers', 'views']).populate({
        path: 'answers',
        populate: 'user'
    });
    questionList.forEach(question => {
        question.answers.sort((a1, a2) => a2.createdAt - a1.createdAt);
    });
    questionList.sort((q1, q2) => {
        const currentTime = new Date().getTime()
        const timeFrame = 300000
        // get number of views in time frame
        const q1Views = q1.views.filter(v => (v.createdAt.getTime() + timeFrame) >= currentTime)
        const q2Views = q2.views.filter(v => (v.createdAt.getTime() + timeFrame) >= currentTime)
        return q2Views.length - q1Views.length
    })
    res.render('hot_questions', {
        title: "What are you looking for?",
        questions: questionList,

    })
}


exports.createQuestion = async (req, res, next) => {
    try {
        let question = await Question.create({
            title: req.body.title,
            description: req.body.description,
            user: req.user.userId,
            labels: req.body.labels.map(label => label._id)
        });
        question = await question.populate(['user', 'labels'])

        res.status(201).json({
            question: question
        });
    } catch (ex) {
        console.log(ex)
        res.status(500).json({
            error: "There was an error creating question"
        });
    }
}

exports.listMyQuestions = async (req, res, next) => {
    let myQuestionList = await Question.find({
        user: req.user.userId
    }).populate(['user', 'labels', 'answers']).populate({
        path: 'answers',
        populate: 'user'
    }).sort({createdAt: -1});

    myQuestionList.forEach(question => {
        question.answers.sort((a1, a2) => a2.createdAt - a1.createdAt);
    });
    res.status(200).render('my_question_list', {
        title: "What I don't know?",
        questions: myQuestionList,
    })
}

exports.deleteMyQuestion = async (req, res, next) => {
    const idQuestion = req.params.id;
    let question = await Question.deleteOne({
        user: req.user.userId,
        _id: idQuestion
    });
    res.status(200).json({
        message: 'Delete successfully'
    })
}

exports.showQuestionById = async (req, res, next) => {
    const questionId = req.params.id;
    let question = await Question.findById({
        user: req.user.userId,
        _id: questionId,
    }).populate(["user", "answers", "labels"]).populate({
        path: 'answers',
        populate: 'user'
    });
    // Create view
    let view = await View.create({
        user: req.user.userId,
        amount: 1
    })
    await Question.updateOne(
        {_id: question._id},
        {$push: {views: view._id}}
    )

    res.render('the_question', {
        title: "Question",
        question: question
    });
}