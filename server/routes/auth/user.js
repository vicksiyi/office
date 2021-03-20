const express = require('express');
const router = express.Router();
const request = require('request');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const User = require('../../models/User');
const LoginLog = require('../../models/LoginLog');
const WXBizDataCrypt = require('../../utils/WXBizDataCrypt');
var redis = require('redis'),
    dbConfig = keys.redis,
    RDS_PORT = dbConfig.port,     //端口号
    RDS_HOST = dbConfig.host,     //服务器IP
    RDS_PWD = dbConfig.pass,      //密码
    RDS_OPTS = { auth_pass: RDS_PWD },
    redisClient = redis.createClient(RDS_PORT, RDS_HOST, RDS_OPTS);
redisClient.on('connect', function () {
    console.log('Oauth redis connect success!');
});

// 返回body
const oauthFunc = (code) => {
    let JSCODE = code
    return new Promise((resolve, reject) => {
        request.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${keys.APPID}&secret=${keys.SECRET}&js_code=${JSCODE}&grant_type=authorization_code`, function (error, response, body) {
            resolve(JSON.parse(body))
        });
    })
}

// $routes /auth/user/login
// @desc 用户初始登录
// @access public
router.post('/login', async (req, res) => {
    let data = await oauthFunc(req.body.code)
    let iv = req.body.iv
    let encryptedData = req.body.encryptedData
    let ip = req.headers['x-wq-realip'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    // 响应
    if (data.openid) {
        let Item = {}
        if (iv && encryptedData) {
            let pc = new WXBizDataCrypt(keys.APPID, data.session_key)

            let dataTemp = pc.decryptData(encryptedData, iv)

            Item.nickName = dataTemp.nickName;
            Item.avatarUrl = dataTemp.avatarUrl;
        }
        Item.openId = data.openid
        redisClient.get(Item.openId, (err, result) => {
            if (result != null) {
                res.json({
                    type: 'close',
                    time: result
                })
                new LoginLog({
                    openId: data.openid,
                    system: req.body.system,
                    model: req.body.model,
                    ip: ip,
                    type: 0
                }).save();
            } else {
                // 更新用户信息
                User.findOne({ openId: data.openid }).then(user => {
                    if (!user) {
                        new User(Item).save().then(user => {
                            res.json({
                                msg: "Success",
                                openId: data.openid
                            })
                            new LoginLog({
                                openId: data.openid,
                                system: req.body.system,
                                model: req.body.model,
                                type: 3,
                                ip: ip
                            }).save();
                        }).catch(err => {
                            res.json({
                                msg: "err"
                            });
                            new LoginLog({
                                openId: data.openid,
                                system: req.body.system,
                                model: req.body.model,
                                type: 2,
                                ip: ip
                            }).save();
                        })
                    } else {
                        res.json({
                            msg: 'Success',
                            openId: data.openid
                        })
                        new LoginLog({
                            openId: data.openid,
                            system: req.body.system,
                            model: req.body.model,
                            type: 1,
                            ip: ip
                        }).save();
                    }
                }).catch(err => {
                    new LoginLog({
                        openId: data.openid,
                        system: req.body.system,
                        model: req.body.model,
                        type: 2
                    }).save();
                    res.json(err);
                })
            }
        })
    } else {
        res.json(data)
    }
})

// $routes /auth/user/auth
// @desc 用户授权
// @access public
router.post('/auth', async (req, res) => {
    // 格式化JSON
    let data = await oauthFunc(req.body['code'])
    let iv = req.body['iv']
    let encryptedData = req.body['encryptedData']
    // 响应
    if (data.openid) {
        if (iv && encryptedData) {
            const rule = { openId: data.openid }
            jwt.sign(rule, keys.secretUser, { expiresIn: 3600 }, (err, token) => {
                if (err) {
                    throw err;
                } else {
                    res.json({
                        success: true,
                        token: 'Bearer ' + token
                    })
                }
            })
        } else {
            res.json({
                msg: "用户未授权"
            })
        }
    } else {
        res.json(data)
    }
})

module.exports = router;