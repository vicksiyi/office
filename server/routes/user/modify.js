const express = require('express');
const router = express.Router();
const passport = require('passport');
// const email = require('emailjs/email');
const email = require('emailjs');
const keys = require('../../config/keys')
const User = require('../../models/User');
const random = require('../../utils/random');
var redis = require('redis'),
    dbConfig = keys.redis,
    RDS_PORT = dbConfig.port,     //端口号
    RDS_HOST = dbConfig.host,     //服务器IP
    RDS_PWD = dbConfig.pass,      //密码
    RDS_OPTS = { auth_pass: RDS_PWD },
    redisClient = redis.createClient(RDS_PORT, RDS_HOST, RDS_OPTS);
redisClient.on('connect', function () {
    console.log('Modify redis connect success!');
});
// $routes GET /user/modify/getUser
// @desc 获取用户信息
// @access private
router.get('/getUser', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json(req.user)
})

// $routes GET /user/modify/test
// @desc 获取用户信息
// @access private
router.get('/test', (req, res) => {
    res.json({ msg: '成功' })
})

// $routes GET /user/modify/editUser
// @desc 修改用户信息
// @access private
router.post('/editUser', passport.authenticate('jwt', { session: false }), (req, res) => {
    let userFileds = {}
    if (req.body.avatarUrl) { userFileds.avatarUrl = req.body.avatarUrl; }
    if (req.body.nickName) { userFileds.nickName = req.body.nickName; }
    if (req.body.msg) { userFileds.msg = req.body.msg; }
    User.findOneAndUpdate({ openId: req.user.openId }, { $set: userFileds }, { new: true }).then(() => {
        res.json({
            type: 'Success'
        })
    }).catch((err) => {
        res.json(err)
    })
})

// $routes /user/modify/sendEmail
// @desc 发送邮箱
// @access private
router.post('/sendEmail', passport.authenticate('jwt', { session: false }), (req, res) => {
    let randomNum = random.randomNumOneToOne(1000, 9999);
    let textTemp = `<div style="margin: 50px auto;width: 800px;height: 500px;background-color: #ffff;-moz-box-shadow: 2px 2px 3px #dddee1;-webkit-box-shadow: 2px 2px 3px #dddee1;box-shadow: 2px 2px 3px #dddee1;border-radius: 25px;text-align: center;padding-top: 30px;"> <text style="width: 300px;height: 40px;font-size: 26px;color: #495060;">斩下Office</text> <div style="width: 80%;margin: 60px auto;text-align: start;"> <div style="margin-top: 20px;margin-left: 20px;color: #1c2438;font-size: 14px;"> <text style="text-align: left;">HI,斩下Office用户你好:</text> <br> 你正在进行斩下Office的邮箱验证，请输入一下验证码，完成验证操作。 </div> <div style="margin-top: 20px;font-size: 40px;font-weight: bold;color: #2b85e4;text-align: center;">${randomNum}</div> <div style="margin-top: 20px;margin-left: 20px;color: #1c2438;font-size: 14px;">如果不是你的邮件请忽略，很抱歉打扰你，请原谅。</div> </div> <div> <hr style="width: 80%;margin: 0 auto;border: 0;height: 1px;background: #333;background-image: linear-gradient(to right, #ccc, #333, #ccc);"> </div> <div style="float: right;margin-top: 30px;margin-right:60px;color: #bbbec4;font-weight: bolder;">斩下Office团队</div> </div>`
    // let server = email.server.connect(keys.email_server);
    const client = new email.SMTPClient(keys.email_server);
    // req.body.email
    client.send({
        text: '邮箱验证',       //邮件内容
        from: '1724264854@qq.com',        //谁发送的
        to: req.body.email,       //发送给谁的
        subject: '斩下Office',          //邮件主题
        attachment: { data: textTemp, alternative: true }
    }, function (err, message) {
        // Set a value with an expiration
        redisClient.set(req.body.email, randomNum);
        redisClient.expire(req.body.email, 60);
        //回调函数
        if (err) {
            res.json(err)
        } else {
            res.json({
                msg: 'Success'
            })
        }
    })
})

// $routes /user/modify/oauthEmail
// @desc 验证邮箱验证码&修改用户邮箱
// @access private
router.post('/oauthEmail', passport.authenticate('jwt', { session: false }), (req, res) => {
    // Set a value with an expiration
    let userFileds = {};
    redisClient.get(req.body.email, function (err, result) {
        console.log(req.body.code, result, req.body.code != result)
        if (result == null || req.body.code != result) {
            res.json({
                type: 'error'
            })
        } else {
            userFileds.email = req.body.email;
            User.findOneAndUpdate({ openId: req.user.openId }, { $set: userFileds }, { new: true }).then(user => {
                res.json({
                    type: 'success'
                });
            }).catch(err => {
                res.json(err);
            })
        }
    })
})

// $routes /user/modify/sendEmail
// @desc 发送邮箱
// @access private
router.post('/sendPhone', passport.authenticate('jwt', { session: false }), (req, res) => {
    let randomNum = random.randomNumOneToOne(1000, 9999);
    redisClient.set(req.body.phone, randomNum);
    redisClient.expire(req.body.phone, 60);
    res.json({
        msg: 'Success'
    })
})


// $routes /user/modify/editPhone
// @desc 修改用户手机号
// @access private
router.post('/oauthPhone', passport.authenticate('jwt', { session: false }), (req, res) => {
    let userFileds = {};
    redisClient.get(req.body.phone, function (err, result) {
        console.log(req.body.code, result, req.body.code != result)
        if (result == null || req.body.code != result) {
            res.json({
                type: 'error'
            })
        } else {
            userFileds.phone = req.body.phone;
            User.findOneAndUpdate({ openId: req.user.openId }, { $set: userFileds }, { new: true }).then(user => {
                res.json({
                    type: 'success'
                });
            }).catch(err => {
                res.json(err);
            })
        }
    })
})
module.exports = router;