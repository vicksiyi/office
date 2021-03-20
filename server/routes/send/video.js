//login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Video = require('../../models/Video');

// $routes POST /send/video/upload
// @desc 发布视频
// @access private
router.post('/upload', passport.authenticate('jwt', { session: false }), (req, res) => {
    item = {}
    item.title = req.body.title;
    item.videoUrl = req.body.uploadVideo;
    item.imageUrl = req.body.uploadImage;
    item.videoClass = req.body.classVideo;
    item.videoMsg = req.body.msg;
    item.videoTag = req.body.tag;
    item.videoTime = req.body.time;
    item.userOpenId = req.user.openId;
    new Video(item).save().then(user => {
        res.json({
            msg: "Success"
        })
    }).catch(err => {
        res.json({
            msg: "err"
        });
    })
})

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

// $routes GET /send/video/getUserVideo
// @desc 获取视频分页获取（某人发布）
// @access private
router.get('/getUserVideo/:start', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.params.start, req.query.openId)
    Video.find({
        userOpenId: req.query.openId
    }).sort({ time: -1 }).skip(req.params.start * 10).limit(10).then(find => {
        if (!find) {
            return res.json({
                msg: 'Null'
            });
        }
        res.json({
            type: 'Success',
            res: find
        });
    }).catch(err => {
        res.json(err);
    })
})

// $routes GET /send/video/myVideo
// @desc 获取我的视频
// @access private
router.get('/myVideo/:start', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.params.start, req.user.openId)
    Video.find({
        userOpenId: req.user.openId
    }).sort({ time: -1 }).skip(req.params.start * 10).limit(10).then(find => {
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
    console.log(req.params.id)
    Video.findOneAndRemove({ _id: req.params.id, userOpenId: req.user.openId }).then(profile => {
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