const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 登录日志表
const LoginLogSchema = new Schema({
    openId: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    system: {
        type: String,
        required: true
    },
    type: {
        type: Number, // 0=>close 1=>success 2=>未知错误 3=>新建用户
        required: true
    },
    ip: {
        type: String,
        required: true
    },
    time: {         // 加入时间
        type: Date,
        default: Date.now
    }
})

module.exports = LoginLog = mongoose.model('LoginLog', LoginLogSchema);