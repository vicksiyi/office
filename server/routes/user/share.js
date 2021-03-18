//login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Share = require('../../models/Share');

// $routes GET /user/share/add
// @desc 分享视频
// @access public
router.get('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.query._id)
    let Item = {
        openId: req.user.openId,
        videoId: req.query._id
    }
    Share.findOne(Item).then(share => {
        new Share(Item).save().then(user => {
            res.json({
                type: "Success"
            })
        }).catch(err => {
            res.json({
                type: "err"
            });
        })
    }).catch(err => {
        res.json(err);
    })
})

// $routes GET /user/share/getNum
// @desc 获取分享数
// @access public
router.get('/getNum', (req, res) => {
    let Item = {
        videoId: req.query._id
    }
    Share.find(Item, (err, result) => {
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