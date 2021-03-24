//login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');
const request = require('request');
const cheerio = require('cheerio');
const News = require('../../models/News');

// $routes GET /news/service/getDoneNews
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

// $routes GET /news/service/getNewsDetail
// @desc 详情
// @access public
router.post('/getNewsDetail', (req, res) => {
    request({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36',
        url: 'https:' + req.body.url
    }, function (error, response, body) {
        if (error) {
            res.json({
                type: 'err'
            })
        }
        const $ = cheerio.load(body);
        res.json({
            type: 'Success',
            content: cheerio.html($('.detailBox-2ms7ofXz')),
            time: $('.time-M6w87NaQ').text()
        })
    });
})
module.exports = router;