//login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');
const Comment = require('../../models/Comment');

// $routes GET /user/comment/getComment
// @desc 获取评论
// @access private
router.get('/getComment/:videoId/:start/:status/:type', passport.authenticate('jwt', { session: false }), (req, res) => {
    let start = req.params.start;
    let videoId = req.params.videoId;
    let status = parseInt(req.params.status);
    let type = parseInt(req.params.type);
    let sort = {}
    if (!status) {
        sort = {
            praise: -1
        }
    } else {
        sort = {
            time: -1
        }
    }
    console.log(start, videoId, status, type, sort)
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
        { $match: { videoId: videoId, type: type } },
        { $sort: sort },
        { $skip: start * 10 },
        { $limit: 10 }
    ]).exec(function (err, result) {
        for (let i = 0; i < result.length; i++) {
            let temp = [];
            temp.push({
                nickName: result[i].user.nickName,
                avatarUrl: result[i].user.avatarUrl,
                openId: result[i].user.openId
            })
            result[i].user = temp;
        }
        res.json({
            type: 'Success',
            res: result
        })
    });
})

// $routes GET /user/comment/add
// @desc 评论
// @access private
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
    let Item = {};
    let type = req.body.type;
    Item.openId = req.user.openId;
    Item.msg = req.body.msg;
    Item.videoId = req.body.videoId;
    Item.system = req.body.system;
    if (type) {
        Item.parentId = req.body.parentId;
        Item.type = 1;
    }
    new Comment(Item).save().then(msg => {
        res.json({
            type: 'Success'
        })
    }).catch(err => {
        res.json({
            type: 'err'
        })
    })
})

// $routes GET /user/comment/addPraise
// @desc 点赞
// @access private
// router.get('/addPraise/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
//     Comment.findOneAndUpdate({ _id: req.params.id }, { $inc: { praise: 1 } }, {
//         new: true,
//         upsert: true
//     }).then(msg => {
        
//     })
// })
module.exports = router;