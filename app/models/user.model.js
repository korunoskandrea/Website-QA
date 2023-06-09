const mongoose = require('mongoose');
const Schema = mongoose.Schema

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    profilePicture: {
        type: String,
    },
    questions: [
        {
            type: mongoose.Types.ObjectId,
            ref: "Question"
        }
    ]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;