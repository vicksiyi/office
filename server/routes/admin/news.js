//login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');
const request = require('request');
const News = require('../../models/News');
const based = 'https://shankapi.ifeng.com/season/getSoFengData/all/office/'

// $routes GET /admin/news/getNews
// @desc 获取新闻
// @access public
router.get('/getNews/:page', passport.authenticate('jwt', { session: false }), (req, res) => {
    request({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
        url: based + req.params.page
    }, function (error, response, body) {
        // console.log(body)
        res.json({
            type: 'Success',
            data: JSON.parse(body.replace(new RegExp("<em>", ("gm")), "").replace(new RegExp("</em>", ("gm")), ""))
        })
    });
})

// $routes GET /admin/news/getNews
// @desc 获取新闻
// @access public
router.post('/addNews', passport.authenticate('jwt', { session: false }), (req, res) => {
    let Item = {};
    Item.title = req.body.title;
    Item.imageUrl = req.body.imageUrl;
    Item.newsUrl = req.body.newsUrl;
    Item.from = req.body.from;
    News.findOne(Item).then(msg => {
        if (msg) {
            res.json({
                type: 'added'
            })
        } else {
            new News(Item).save().then(result => {
                res.json({
                    type: 'Success'
                })
            }).catch(err => {
                res.json({
                    type: 'error'
                })
            })
        }
    })
})

// $routes GET /admin/news/getDoneNews
// @desc 获取已经推送的新闻
// @access public
router.get('/getDoneNews/:start', passport.authenticate('jwt', { session: false }), (req, res) => {
    News.find().sort({ time: -1 }).skip(req.params.start * 10).limit(10).then(msg => {
        res.json({
            type: 'Success',
            msg: msg
        })
    }).catch(err => {
        res.json({
            type: 'err'
        })
    })
})

// $routes GET /admin/news/getDoneNews
// @desc 获取已经推送的新闻
// @access public
router.get('/delNews/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    News.findOneAndRemove({ _id: req.params.id }).then(profile => {
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
module.exports = router;