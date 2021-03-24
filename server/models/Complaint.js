const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 稿件投诉表
const ComplaintSchema = new Schema({
    openId: {
        type: String,
        require: true
    },
    imageList: {
        type: String,
        require: true
    },
    msg: {
        type: String,
        require: true
    },
    videoId:{
        type: String,
        require: true
    },
    classId: {
        type: String,
        require: true
    },
    isDone: {
        type: Boolean,
        require: true
    },
    time: {         // 加入时间
        type: Date,
        default: Date.now
    }
})

module.exports = Complaint = mongoose.model('Complaint', ComplaintSchema);