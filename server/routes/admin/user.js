//login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../../models/User');
const keys = require('../../config/keys');
const LoginLog = require('../../models/LoginLog');
var redis = require('redis'),
    dbConfig = keys.redis,
    RDS_PORT = dbConfig.port,     //端口号
    RDS_HOST = dbConfig.host,     //服务器IP
    RDS_PWD = dbConfig.pass,      //密码
    RDS_OPTS = { auth_pass: RDS_PWD },
    redisClient = redis.createClient(RDS_PORT, RDS_HOST, RDS_OPTS);
redisClient.on('connect', function () {
    console.log('redis connect success!');
});

// $routes GET /admin/user/getNum
// @desc 获取系统用户数
// @access private
router.get('/getNum', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.find().then(find => {
        res.json({
            type: 'Success',
            num: find.length
        });
    }).catch(err => {
        res.json(err);
    })
})

// $routes GET /admin/user/getUserNum
// @desc 今日使用用户
// @access private
router.get('/getDayUserNum', passport.authenticate('jwt', { session: false }), (req, res) => {
    let end = Date.now()
    let start = parseInt(end / (1000 * 60 * 60 * 24)) * 1000 * 60 * 60 * 24
    LoginLog.aggregate(
        [
            {
                $match:
                {
                    time: { $gte: new Date(start), $lt: new Date(end) }
                }
            },
            {
                $group:
                {
                    _id: "$openId",
                    count: { $sum: 1 }
                },
            }
        ]
    ).exec(function (err, result) {
        res.json({
            type: 'Success',
            num: result.length
        })
    });
})

// $routes GET /admin/user/getDayLogNum
// @desc 今日访问次数
// @access private
router.get('/getDayLogNum', passport.authenticate('jwt', { session: false }), (req, res) => {
    let end = Date.now()
    let start = parseInt(end / (1000 * 60 * 60 * 24)) * 1000 * 60 * 60 * 24
    LoginLog.find({
        time: { $gte: new Date(start), $lt: new Date(end) }
    }).then((result) => {
        res.json({
            type: 'Success',
            num: result.length
        })
    })
})

// $routes GET /admin/user/getRegisterNum
// @desc 今日注册用户数
// @access private
router.get('/getRegisterNum', passport.authenticate('jwt', { session: false }), (req, res) => {
    let end = Date.now()
    let start = parseInt(end / (1000 * 60 * 60 * 24)) * 1000 * 60 * 60 * 24
    LoginLog.find({
        time: { $gte: new Date(start), $lt: new Date(end) },
        type: 3
    }).then((result) => {
        res.json({
            type: 'Success',
            num: result.length
        })
    })
})
// $routes GET /admin/user/getUser
// @desc 获取系统用户
// @access private
router.get('/getUser/:start', passport.authenticate('jwt', { session: false }), (req, res) => {
    User.find().sort({ time: -1 }).skip(req.params.start * 20).limit(20).then(find => {
        res.json({
            type: 'Success',
            user: find
        });
    }).catch(err => {
        res.json(err);
    })
})

// $routes GET /admin/user/modifyUser
// @desc 修改用户信息
// @access private
router.post('/modifyUser', passport.authenticate('jwt', { session: false }), (req, res) => {
    let Item = {}
    if (req.body.nickName) { Item.nickName = req.body.nickName; }
    if (req.body.avatarUrl) { Item.avatarUrl = req.body.avatarUrl; }
    if (req.body.email) { Item.email = req.body.email; }
    if (req.body.phone) { Item.phone = req.body.phone; }
    if (req.body.msg) { Item.msg = req.body.msg; }
    User.findOneAndUpdate({ _id: req.body._id }, { $set: Item }, { new: true }).then(() => {
        res.json({
            type: 'Success'
        })
    }).catch((err) => {
        res.json(err)
    })
})

// $routes GET /admin/user/closeUser
// @desc 封号时长(小时)
// @access private
router.post('/closeUser', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Set a value with an expiration
    redisClient.set(req.body.openId, req.body.time);
    redisClient.expire(req.body.openId, parseInt(req.body.hour) * 60 * 60);
    res.json({
        type: 'Success'
    })
})

// $routes GET /admin/user/testClose
// @desc 获取封号时长(小时)
// @access private
router.post('/testClose', passport.authenticate('jwt', { session: false }), (req, res) => {
    redisClient.get(req.body.openId, function (err, result) {
        if (result == null) {
            res.json({
                type: 'Success',
                close: false
            })
        } else {
            res.json({
                type: 'Success',
                close: true,
                time: result
            })
        }
    })
})

// $routes GET /admin/user/delClose
// @desc 解封
// @access private
router.post('/delClose', passport.authenticate('jwt', { session: false }), (req, res) => {
    redisClient.del(req.body.openId);
    res.json({
        type: 'Success'
    })
})
module.exports = router;