const User = require('../models/user.model')
const Question = require('../models/question.model')

exports.listInformation = async (req, res, next) => {
    let user = await User.findById(req.user.userId);
    let userQuestions = await Question.find({
        user: user._id
    });
    res.status(200).render('user/my_profile', {
        title: "My information",
        user: user,
        token: req.query.token,
        questions: userQuestions
    })
}

exports.getMe = async (req, res, next) => {
    res.status(200).json({
        user: req.user,
    })
}

exports.addImage = async (req, res) => {
    try {
        await User.updateOne({
            _id: req.user.userId
        }, {
            profilePicture: `http://localhost:3000/images/${req.file.filename}`
        })

        return res.redirect('/');
    } catch (err) {
        return res.status(500).json({
            message: 'Error when updating user',
            error: err,
        });
    }
}
