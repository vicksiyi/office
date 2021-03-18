//login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');
const ExamRecord = require('../../models/ExamRecord');

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

module.exports = router;