//login & register
const express = require('express');
const passport = require('passport');
const router = express.Router();
const CustomerService = require('../../models/CustomerService');

// $routes GET /customer/service/add
// @desc 提交反馈
// @access public
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
    let Item = {};
    Item.openId = req.user.openId;
    Item.imageList = req.body.imageList;
    Item.msg = req.body.msg;
    new CustomerService(Item).save().then((service) => {
        res.json({
            type: 'Success'
        })
    }).catch(err => {
        console.log(err)
        res.json({
            type: "err"
        });
    })
})

module.exports = router;