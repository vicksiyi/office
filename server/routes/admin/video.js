//login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Video = require('../../models/Video');
const SeriesVideo = require('../../models/SeriesVideos');

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

// $routes GET /admin/video/delVideo
// @desc 删除视频
// @access private
router.get('/delVideo/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Video.findOneAndRemove({ _id: req.params.id }).then(profile => {
        if (profile) {
            res.json({
                type: 'Success'
            })
        } else {
            res.json({
                type: 'deled'
            })
        }
    }).catch(err => {
        res.json({
            type: 'error'
        })
    })
})

// $routes GET /admin/video/getOneVideo
// @desc 获取单个视频
// @access private
router.get('/getOneVideo/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    console.log(req.params.id)
    Video.findOne({ _id: req.params.id }).then(profile => {
        if (profile) {
            res.json({
                type: 'Success',
                profile
            })
        } else {
            res.json({
                type: 'deled'
            })
        }
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
    Video.find({
        $or: [
            { title: keyword },
            { videoClass: keyword },
            { videoMsg: keyword },
            { videoTag: keyword }
        ]
    }).sort({ time: -1 }).skip(req.params.start * 10).limit(10).then(Msg => {
        res.json(Msg);
    }).catch(err => {
        res.json(err);
    })
})

// $routes GET /send/video/seriesVideo
// @desc 上传系列视频
// @access private
router.post('/seriesVideo', passport.authenticate('jwt', { session: false }), (req, res) => {
    let Item = {
        videoUrl: req.body.videoUrl,
        title: req.body.title,
        type: req.body.type,
        img: req.body.img
    }
    new SeriesVideo(Item).save().then(() => {
        res.json({
            type: 'Success'
        })
    }).catch((err) => {
        res.json({
            type: 'err'
        })
    })
})

// $routes GET /send/video/getSeriesVideo
// @desc 获取系列视频
// @access private
router.get('/getSeriesVideo/:type/:page', passport.authenticate('jwt', { session: false }), (req, res) => {
    let type = req.params.type;
    let page = req.params.page;
    SeriesVideo.find({
        type: type
    }).sort({ time: -1 }).skip(page * 10).limit(10).then(Msg => {
        res.json(Msg);
    }).catch(err => {
        res.json({
            type: 'err'
        });
    })
})
module.exports = router;