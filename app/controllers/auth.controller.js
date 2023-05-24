const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user.model')

require('dotenv').config()

exports.register = (req, res, next) => {
    res.render('auth/register', {});

}

exports.registerPost = async (req, res, next) => {
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    try {
        await User.create({ // all calls for base => await ...
            username: req.body.username,
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hashPassword
        });
    } catch (ex) {
        res.render('auth/register', {
            errorMsg: "Username/email already exists..."
        });
        return;
    }

    res.render('auth/register', {});
}

exports.login = (req, res, next) => {
    res.render('auth/login', {});

}

exports.loginPost = async (req, res, next) => {
    const expirationSeconds = 1800;
    try {
        const user = await User.findOne({
            $or: [
                {username: req.body.username}, // there can be more information
                {email: req.body.username}
            ]
        }).select('+password');
        // checks if the user with the given email/username was found and the given password is correct
        if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
            res.status(500).render('auth/login', {
                errorMsg: "Incorrect username or password"
            });
            return; // if there isn't return a header would be sent twice (another response would be sent)
        }
        // create jwt that expires in 30 min
        const token = jwt.sign({
                username: req.body.username,
                userId: user._id
            },
            process.env.SECRET_JWT_KEY,
            {expiresIn: `${expirationSeconds}s`});
        const expirationDate = Math.floor(new Date().getTime() / 1000) + expirationSeconds;
        res.render('question_list', {
            title: "What are you looking for?",
            token: token,  // da si browser sharni
            expiresIn: expirationDate,
        });
    } catch (ex) {
        console.log(ex);
        res.status(500).render('auth/login', {
            errorMsg: "Error while log-in"
        });
    }
}

