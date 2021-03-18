const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 小程序用户
const FocusSchema = new Schema({
    openId: {
        type: String,
        required: true
    },
    toOpenId: {
        type: String,
        required: true
    },
    time: {         // 加入时间
        type: Date,
        default: Date.now
    }
})

module.exports = Focus = mongoose.model('Focus', FocusSchema);