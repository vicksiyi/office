const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 收藏表
const CollectionSchema = new Schema({
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

module.exports = Collection = mongoose.model('Collection', CollectionSchema);