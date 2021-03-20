//login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Video = require('../../models/Video');

// $routes GET /send/video/getVideo
// @desc 获取视频分页获取
// @access private
router.get('/getVideo/:start', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.params.start)
    Video.find().sort({ time: -1 }).skip(req.params.start * 10).limit(10).then(find => {
        if (!find) {
            return res.json({
                msg: 'Null'
            });
        }
        res.json(find);
    }).catch(err => {
        res.json(err);
    })
})

// $routes GET /send/video/delVideo
// @desc 删除视频
// @access private
router.get('/delVideo/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Video.findOneAndRemove({ _id: req.params.id }).then(profile => {
        res.json({
            type: 'Success'
        })
    }).catch(err => {
        res.json({
            type: 'error'
        })
    })
})

// $routes GET /send/video/getOneVideo
// @desc 获取单个视频
// @access private
router.get('/getOneVideo/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.params.id)
    Video.findOne({ _id: req.params.id }).then(profile => {
        res.json({
            type: 'Success',
            profile
        })
    }).catch(err => {
        res.json({
            type: 'error'
        })
    })
})


// $routes GET /send/video/searchVideo
// @desc 搜索视频
// @access private
router.get('/searchVideo/:start', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.query)
    const keyword = new RegExp(req.query.title);
    Video.find({ title: keyword }).sort({ time: -1 }).skip(req.params.start * 10).limit(10).then(Msg => {
        res.json(Msg);
    }).catch(err => {
        res.json(err);
    })
})
module.exports = router;