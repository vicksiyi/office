const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 小程序用户
const NoticeSchema = new Schema({
    adminId: {
        type: String,
        required: true
    },
    msg: {
        type: String,
        required: true
    },
    time: {         // 加入时间
        type: Date,
        default: Date.now
    }
})

module.exports = Notice = mongoose.model('Notice', NoticeSchema);