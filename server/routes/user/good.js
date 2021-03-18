//login & register
const express = require('express');
const passport = require('passport');
const router = express.Router();
const Good = require('../../models/Good');

// $routes GET /user/good/add
// @desc 点赞视频
// @access public
router.get('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.query._id)
    let Item = {
        openId: req.user.openId,
        videoId: req.query._id
    }
    Good.findOne(Item).then(good => {
        if (!good) {
            new Good(Item).save().then(user => {
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

// $routes GET /user/good/test
// @desc 是否点赞
// @access private
router.get('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
    Good.findOne({ openId: req.user.openId, videoId: req.query._id }).then(good => {
        if (!good) {
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


// $routes GET /user/good/clear
// @desc 取消点赞视频
// @access public
router.get('/clear', passport.authenticate('jwt', { session: false }), (req, res) => {
    let Item = {
        openId: req.user.openId,
        videoId: req.query._id
    }
    Good.remove(Item, (err, result) => {
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

// $routes GET /user/good/getNum
// @desc 获取点赞数
// @access public
router.get('/getNum', (req, res) => {
    let Item = {
        videoId: req.query._id
    }
    Good.find(Item, (err, result) => {
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
module.exports = router;