//login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Focus = require('../../models/Focus');
const User = require('../../models/User');

// $routes GET /user/focus/add
// @desc 关注
// @access private
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.user.openId, req.body.openId)
    let Item = {
        openId: req.user.openId,
        toOpenId: req.body.openId
    }
    Focus.findOne({ openId: req.user.openId, toOpenId: req.body.openId }).then(focus => {
        if (!focus) {
            new Focus(Item).save().then(user => {
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
    }).catch(err => {
        res.json(err);
    })
})

// $routes GET /user/focus/add
// @desc 是否关注
// @access private
router.post('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
    Focus.findOne({ openId: req.user.openId, toOpenId: req.body.openId }).then(focus => {
        if (!focus) {
            res.json({
                type: false
            })
        } else {
            res.json({
                type: true
            })
        }
    }).catch(err => {
        res.json(err);
    })
})

// $routes GET /user/focus/userDetail
// @desc 获取用户信息
// @access private
router.post('/userDetail', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.findOne({ openId: req.body.openId }).then(user => {
        if (!user) {
            res.json({
                type: 'err'
            })
        } else {
            let item = {
                nickName: user.nickName,
                avatarUrl: user.avatarUrl,
                openId: user.openId
            }
            res.json(item)
        }
    }).catch(err => {
        res.json(err);
    })
})

// $routes GET /user/focus/getFocus
// @desc 获取用户信息
// @access private
router.get('/getFocus/:start', passport.authenticate('jwt', { session: false }), (req, res) => {
    let start = req.params.start;
    Focus.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "toOpenId",
                foreignField: "openId",
                as: "user"
            }
        },
        { $unwind: "$user" },
        { $match: { openId: req.user.openId } },
        { $skip: start * 10 },
        { $limit: 10 }
    ]).exec(function (err, result) {
        let temp = [];
        for (let i = 0; i < result.length; i++) {
            temp.push({
                nickName: result[i].user.nickName,
                avatarUrl: result[i].user.avatarUrl,
                openId: result[i].user.openId
            })
        }
        res.json({
            type: 'Success',
            res: temp
        })
    });
})

// $routes GET /user/focus/clearFocus
// @desc 取消关注
// @access private
router.get('/clearFocus/:openId', passport.authenticate('jwt', { session: false }), (req, res) => {
    let openId = req.params.openId;
    console.log(req.params.openId)
    Focus.remove({
        openId: req.user.openId,
        toOpenId: openId
    }, (err, result) => {
        if (err) {
            res.json({
                type: 'err'
            })
        } else {
            res.json({
                type: 'Success'
            })
        }
    })
})
module.exports = router;