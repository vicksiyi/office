const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 小程序用户
const VideoSchema = new Schema({
    title: {         // 昵称(默认微信昵称)
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    imageUrl: {        // 手机号码
        type: String,
        required: true
    },
    videoClass: {        // 常用邮箱
        type: String,
        required: true
    },
    videoMsg: {        // openId
        type: String,
        required: true
    },
    videoTag: {
        type: String,
        require: true
    },
    videoTime: {
        type: String,
        require: true
    },
    time: {         // 加入时间
        type: Date,
        default: Date.now
    }
})

module.exports = Video = mongoose.model('video', VideoSchema);