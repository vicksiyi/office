//login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Notice = require('../../models/Notice');
const mongoose = require('mongoose');
const NoticeLog = require('../../models/NoticeLog');
const User = require('../../models/User');

// $routes GET /admin/notice/add
// @desc 发布公告
// @access private
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
    let Item = {};
    Item.adminId = req.user._id
    Item.msg = req.body.msg;
    new Notice(Item).save().then(() => {
        res.json({
            type: 'Success'
        });
    }).catch(err => {
        console.log(err)
        res.json({
            type: 'err'
        });
    })
})


// $routes GET /admin/notice/getLastNotice
// @desc 获取最新公告
// @access private
router.get('/getLastNotice', passport.authenticate('jwt', { session: false }), (req, res) => {
    Notice.findOne().sort({ time: -1 }).then(msg => {
        res.json({
            type: 'Success',
            data: msg
        })
    })
})

// $routes GET /admin/notice/getLastNoticeStatic
// @desc 获取最新公告收到情况
// @access private
router.get('/getLastNoticeStatic', passport.authenticate('jwt', { session: false }), (req, res) => {
    Notice.findOne().sort({ time: -1 }).then(msg => {
        NoticeLog.find({
            msgId: mongoose.Types.ObjectId(msg._id).toString()
        }).then(result => {
            User.find().then((user) => {
                res.json({
                    type: 'Success',
                    num: result.length,
                    allNum: user.length
                })
            })
        }).catch((err) => {
            res.json({
                type: 'err'
            })
        })
    })
})

// $routes GET /admin/notice/getNotice
// @desc 获取公告
// @access private
router.get('/getNotice/:start', passport.authenticate('jwt', { session: false }), (req, res) => {
    Notice.find().sort({ time: -1 }).skip(req.params.start * 10).limit(10).then(result => {
        res.json({
            type: 'Success',
            notice: result
        });
    }).catch(err => {
        res.json({
            type: 'err'
        })
    })
})

// $routes GET /admin/notice/getNoticeStatic
// @desc 获取某条公告收到情况
// @access private
router.post('/getNoticeStatic', passport.authenticate('jwt', { session: false }), (req, res) => {
    NoticeLog.find({
        msgId: mongoose.Types.ObjectId(req.body.msgId).toString()
    }).then(result => {
        User.find().then((user) => {
            res.json({
                type: 'Success',
                num: result.length,
                allNum: user.length
            })
        })
    }).catch((err) => {
        res.json({
            type: 'err'
        })
    })
})


// $routes GET /admin/notice/delNotice
// @desc 删除公告
// @access private
router.get('/delNotice/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Notice.findOneAndRemove({ _id: req.params.id}).then(msg => {
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