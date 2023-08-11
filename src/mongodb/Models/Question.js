const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true,
        min: 10,
        trim: true
    },
    options: [
        {
            type: String,
            trim: true
        }
    ]
},

);

module.exports = mongoose.model("Question", QuestionSchema);