const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 管理员表
const NewsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    newsUrl: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    time: {         // 加入时间
        type: Date,
        default: Date.now
    }
})

module.exports = News = mongoose.model('News', NewsSchema);