const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 分享表
const ShareSchema = new Schema({
    openId: {
        type: String,
        required: true
    },
    videoId: {
        type: String,
        required: true
    },
    time: {         // 加入时间
        type: Date,
        default: Date.now
    }
})

module.exports = Share = mongoose.model('Share', ShareSchema);