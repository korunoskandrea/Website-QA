const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LabelSchema = new Schema({
    text: {
        type: String,
        required: true,
        unique: true,
    },
    color: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Label = mongoose.model('Label', LabelSchema);

module.exports = Label;