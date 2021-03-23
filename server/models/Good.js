const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 点赞表
const GoodSchema = new Schema({
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

module.exports = Good = mongoose.model('Good', GoodSchema);