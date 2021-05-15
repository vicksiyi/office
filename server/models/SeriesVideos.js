const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 分享表
const SeriesVideosSchema = new Schema({
    videoUrl: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    time: {         // 加入时间
        type: Date,
        default: Date.now
    }
})

module.exports = SeriesVideos = mongoose.model('SeriesVideos', SeriesVideosSchema);