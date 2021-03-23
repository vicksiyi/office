const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 视频表
const VideoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    videoClass: {
        type: String,
        required: true
    },
    videoMsg: {
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
    userOpenId: {
        type: String,
        require: true
    },
    time: {
        type: Date,
        default: Date.now
    }
})

module.exports = Video = mongoose.model('video', VideoSchema);