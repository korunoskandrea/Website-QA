const express = require('express');
const cors = require('cors');
const path = require('path');
const hbs = require('hbs');
const app = express();
const authRoutes = require("./routes/auth.routes")
const questionRoutes = require("./routes/question.routes")
const userRoutes = require("./routes/user.routes")
const labelRoutes = require("./routes/label.routes")

const jwt = require("jsonwebtoken");
const publicPath = path.join(__dirname, '..', 'public')

app.set('view engine', 'hbs');


app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static(publicPath));

hbs.registerPartials(path.join(__dirname, 'views', 'partials'), function (err) {
});
hbs.registerHelper('dateFormat', require('handlebars-dateformat'));

app.set('views', path.join(__dirname, 'views'));

app.use(cors());

app.use(async (req, res, next) => {
    let token = 'Invalid';
    if (req.headers.authorization) {
        token = req.headers.authorization.split(' ')[1]
    } else if (req.query['token']) {
        token = req.query['token'];
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_JWT_KEY);
        req.user = decoded;
    } catch (err) {
    }
    next();
});

app.use('/auth', authRoutes) // every auth route firstly has /auth then the other things
app.use(questionRoutes)
app.use(userRoutes)
app.use(labelRoutes)

module.exports = app;