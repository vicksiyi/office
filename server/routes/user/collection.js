//login & register
const express = require('express');
const passport = require('passport');
const router = express.Router();
const Collection = require('../../models/Collection');

// $routes GET /user/collection/add
// @desc 收藏视频
// @access public
router.get('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.query._id)
    let Item = {
        openId: req.user.openId,
        videoId: req.query._id
    }
    Collection.findOne(Item).then(collection => {
        if (!collection) {
            new Collection(Item).save().then(user => {
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

// $routes GET /user/collection/add
// @desc 是否收藏
// @access private
router.get('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
    Collection.findOne({ openId: req.user.openId, videoId: req.query._id }).then(collection => {
        if (!collection) {
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


// $routes GET /user/collection/clear
// @desc 取消收藏视频
// @access public
router.get('/clear', passport.authenticate('jwt', { session: false }), (req, res) => {
    let Item = {
        openId: req.user.openId,
        videoId: req.query._id
    }
    Collection.remove(Item, (err, result) => {
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

// $routes GET /user/collection/getNum
// @desc 获取收藏数
// @access public
router.get('/getNum', (req, res) => {
    let Item = {
        videoId: req.query._id
    }
    Collection.find(Item, (err, result) => {
        console.log(result)
        if (err) {
            res.json({
                type: 'err'
            })
        } else {
            res.json({
                type: 'Success',
                num: result.length
            })
        }
    })
})

// $routes GET /user/collection/getUserCollection
// @desc 获取我的收藏
// @access private
router.get('/getUserCollection/:start', passport.authenticate('jwt', { session: false }), (req, res) => {
    let start = req.params.start;
    Collection.aggregate([
        {
            "$lookup": {
                "from": "videos",
                "let": { "id": "$videoId" },
                "pipeline": [
                    {
                        "$match": {
                            "$expr": { "$eq": ["$$id", { "$toString": "$_id" }] }
                        }
                    }
                ],
                "as": "videos"
            }
        },
        { $match: { openId: req.user.openId } },
        { $skip: start * 10 },
        { $limit: 10 }
    ]).exec(function (err, result) {
        console.log(result.length)
        for (let i = 0; i < result.length; ++i) {
            result[i] = result[i].videos[0]
        }
        res.json({
            type: 'Success',
            res: result
        })
    });
})
module.exports = router;