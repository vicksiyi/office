const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 小程序用户
const NoticeLogSchema = new Schema({
    msgId: {
        type: String,
        required: true
    },
    openId:{
        type: String,
        required: true
    },
    time: {         // 加入时间
        type: Date,
        default: Date.now
    }
})

module.exports = NoticeLog = mongoose.model('NoticeLog', NoticeLogSchema);