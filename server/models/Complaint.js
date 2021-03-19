const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 小程序用户
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
    classId: {
        type: ObjectId,
        require: true
    },
    time: {         // 加入时间
        type: Date,
        default: Date.now
    }
})

module.exports = Complaint = mongoose.model('Complaint', ComplaintSchema);