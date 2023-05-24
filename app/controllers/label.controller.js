const Label = require('../models/label.model')
const Question = require('../models/question.model')

exports.createLabel = async (req, res, next) => {
    try {
        const newLabel = await Label.create({
            text: req.body.text, color: req.body.color,
        });

        res.status(201).json({
            label: newLabel,
        })
    } catch (ex) {
        console.log(ex)
        res.status(500).json({
            message: 'Cannot create label with this name'
        })
    }
}

exports.getLabels = async (req, res, next) => {
    const labels = await Label.find();
    res.status(200).json({
        labels: labels,
    })

}

