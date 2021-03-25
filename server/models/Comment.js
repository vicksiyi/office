const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 稿件投诉表
const CommentSchema = new Schema({
    openId: {
        type: String,
        require: true
    },
    msg: {
        type: String,
        require: true
    },
    videoId: {
        type: String,
        require: true
    },
    model: {
        type: String,
        require: true,
        default: '未知'
    },
    praise: {
        type: Number,
        require: true,
        default: 0
    },
    bad: {
        type: Number,
        require: true,
        default: 0
    },
    parentId: {
        type: String,
        require: true
    },
    type: {
        type: Number,
        require: true,
        default: 0
    },
    time: {         // 加入时间
        type: Date,
        default: Date.now
    }
})

module.exports = Comment = mongoose.model('Comment', CommentSchema);