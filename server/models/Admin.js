const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 管理员表
const AdminSchema = new Schema({
    name: {         
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    time: {         // 加入时间
        type: Date,
        default: Date.now
    }
})

module.exports = Admin = mongoose.model('Admin', AdminSchema);