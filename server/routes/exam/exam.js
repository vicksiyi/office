//login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');
const ExamRecord = require('../../models/ExamRecord');
const RecordClass = require('../../models/RecordClass');

// $routes GET /exam/exam/add
// @desc 添加答题记录
// @access public
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
    let Item = {}
    Item.openId = req.user.openId;
    Item.result = parseInt(req.body.result);
    Item.type = parseInt(req.body.type);
    Item.titleList = req.body.titleList;
    Item.answerList = req.body.answerList;
    console.log(Item)
    new ExamRecord(Item).save().then((exam) => {
        res.json({
            type: "Success"
        })
    }).catch(err => {
        console.log(err)
        res.json({
            type: "err"
        });
    })
})

// $routes GET /exam/exam/getExam
// @desc 获取刷题记录
// @access public
router.get('/getExam/:start', passport.authenticate('jwt', { session: false }), (req, res) => {
    ExamRecord.find({ openId: req.user.openId }).sort({ time: -1 }).skip(req.params.start * 20).limit(20).then(Msg => {
        res.json(Msg);
    }).catch(err => {
        res.json(err);
    })
})

// $routes GET /exam/exam/addRecordClass
// @desc 错题集
// @access public
router.get('/addRecordClass/:id/:type', passport.authenticate('jwt', { session: false }), (req, res) => {
    let Item = {};
    Item.openId = req.user.openId;
    Item.titleId = req.params.id;
    Item.type = req.params.type;
    RecordClass.findOne(Item).then((result) => {
        if (!result) {
            new RecordClass(Item).save().then((exam) => {
                res.json({
                    type: "Success"
                })
            }).catch(err => {
                res.json({
                    type: "err"
                });
            })
        } else {
            res.json({
                type: 'added'
            })
        }
    })
})

// $routes GET /exam/exam/getRecordClass
// @desc 获取错题集
// @access public
router.get('/getRecordClass/:start', passport.authenticate('jwt', { session: false }), (req, res) => {
    RecordClass.find({ openId: req.user.openId }).sort({ time: -1 }).skip(req.params.start * 10).limit(10).then(Msg => {
        res.json(Msg);
    }).catch(err => {
        res.json(err);
    })
})
module.exports = router;