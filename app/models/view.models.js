const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ViewSchema = new Schema({
        user: {
            type: mongoose.Types.ObjectId,
            ref: "User"
        },
        amount: {
            type: Number,
            required: true
        }
    },
    {timestamps: true});

const View = mongoose.model('View', ViewSchema);

module.exports = View;