//login & register
const express = require('express');
const jwt = require('jsonwebtoken');
const sha1 = require('sha1');
const router = express.Router();
const Admin = require('../../models/Admin');
const keys = require('../../config/keys');

// $routes GET /admin/service/login
// @desc 管理员登录
// @access public
router.post('/login', (req, res) => {
    let Item = {}
    Item.name = req.body.name;
    Item.password = sha1(req.body.name + req.body.password);
    Admin.findOne(Item).then((result) => {
        console.log(result)
        if (result) {
            jwt.sign(Item, keys.secretAdmin, { expiresIn: 3600 }, (err, token) => {
                if (err) {
                    throw err;
                } else {
                    res.json({
                        type: 'Success',
                        token: 'Bearer ' + token
                    })
                }
            })
        } else {
            res.json({
                type: 'error'
            })
        }
    })
})

// $routes GET /admin/service/register
// @desc  注册
// @access public
router.post('/register', (req, res) => {
    let Item = {}
    Item.name = req.body.name;
    Item.password = sha1(req.body.name + req.body.password);
    new Admin(Item).save().then(() => {
        res.json({
            type: 'Success'
        })
    }).catch((err) => {
        res.json({
            type: 'err'
        })
    })
})
module.exports = router;