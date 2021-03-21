//login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const Notice = require('../../models/Notice');
const NoticeLog = require('../../models/NoticeLog');

// $routes GET /admin/notice/getLastNotice
// @desc 获取最新公告
// @access private
router.get('/getLastNotice', passport.authenticate('jwt', { session: false }), (req, res) => {
    Notice.findOne().sort({ time: -1 }).then(msg => {
        console.log(mongoose.Types.ObjectId(msg._id).toString())
        NoticeLog.findOne({
            openId: req.user.openId,
            msgId: mongoose.Types.ObjectId(msg._id).toString()
        }).then(result => {
            if (result) {
                res.json({
                    type: 'added'
                })
            } else {
                res.json({
                    type: 'Success',
                    data: msg
                })
            }
        })
    })
})

// $routes GET /admin/notice/add
// @desc 收到
// @access private
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
    let Item = {};
    Item.msgId = req.body.msgId;
    Item.openId = req.user.openId;
    new NoticeLog(Item).save().then(msg => {
        res.json({
            type: 'Success'
        })
    }).catch(err => {
        res.json({
            type: 'err'
        })
    })
})
module.exports = router;