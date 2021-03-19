const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 小程序用户
const UserSchema = new Schema({
    nickName: {         // 昵称(默认微信昵称)
        type: String,
        required: true
    },
    avatarUrl: {
        type: String,
        required: true
    },
    phone: {        // 手机号码
        type: String,
        required: false
    },
    email: {        // 常用邮箱
        type: String,
        required: false
    },
    openId: {        // openId
        type: String,
        required: true
    },
    msg:{
        type:String,
        default: '用户什么都没留下...'
    },
    time: {         // 加入时间
        type: Date,
        default: Date.now
    }
})

module.exports = User = mongoose.model('user', UserSchema);