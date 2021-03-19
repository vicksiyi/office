const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 小程序用户
const RecordClassSchema = new Schema({
    openId: {
        type: String,
        required: true
    },
    titleId: {
        type: String,
        required: true
    },
    type: {
        type: Number,
        required: true
    },
    time: {         // 加入时间
        type: Date,
        default: Date.now
    }
})

module.exports = RecordClass = mongoose.model('RecordClass', RecordClassSchema);