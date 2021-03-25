//login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const Comment = require('../../models/Comment');

// $routes GET /user/comment/getComment
// @desc 获取评论
// @access private
router.get('/getComment/:videoId/:start/:status', passport.authenticate('jwt', { session: false }), (req, res) => {
    let start = req.params.start;
    let videoId = req.params.openId;
    let status = req.params.status;
    let sort = {}
    if (status) {
        sort = {
            praise: -1
        }
    } else {
        sort = {
            time: -1
        }
    }
    Comment.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "openId",
                foreignField: "openId",
                as: "user"
            }
        },
        { $unwind: "$user" },
        { $match: { videoId: videoId, type: 0 } },
        { $sort: sort },
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

// $routes GET /user/comment/add
// @desc 评论
// @access private
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
    let Item = {};
    let type = req.body.type;
    Item.msgId = req.body.msg;
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