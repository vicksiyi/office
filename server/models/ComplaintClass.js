const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 稿件投诉类别表
const ComplaintClassSchema = new Schema({
    title: {
        type: 'String',
        require: true
    },
    time: {         // 加入时间
        type: Date,
        default: Date.now
    }
})

module.exports = ComplaintClass = mongoose.model('ComplaintClass', ComplaintClassSchema);