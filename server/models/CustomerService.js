const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 小程序用户
const CustomerServiceSchema = new Schema({
    openId: {
        type: String,
        required: true
    },
    imageList: {
        type: String,
        required: true
    },
    msg: {
        type: String,
        required: true
    },
    time: {         // 加入时间
        type: Date,
        default: Date.now
    }
})

module.exports = CustomerService = mongoose.model('CustomerService', CustomerServiceSchema);