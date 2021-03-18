const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 小程序用户
const ExamRecordSchema = new Schema({
    openId: {
        type: String,
        required: true
    },
    result: {
        type: Number,
        required: true
    },
    type: {
        type: Number,
        required: true
    },
    titleList: {
        type: String,
        required: true
    },
    answerList: {
        type: String,
        required: true
    },
    time: {         // 加入时间
        type: Date,
        default: Date.now
    }
})

module.exports = ExamRecord = mongoose.model('ExamRecord', ExamRecordSchema);