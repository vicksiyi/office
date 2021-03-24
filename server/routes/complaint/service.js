//login & register
const express = require('express');
const passport = require('passport');
const router = express.Router();
const CustomerService = require('../../models/CustomerService');
const Complaint = require('../../models/Complaint');
const ComplaintClass = require('../../models/ComplaintClass');

// $routes GET /complaint/service/add
// @desc 提交反馈
// @access public
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
    let Item = {};
    Item.openId = req.user.openId;
    Item.imageList = req.body.imageList;
    Item.msg = req.body.msg;
    Item.videoId = req.body.videoId;
    Item.classId = req.body.classId;
    Item.isDone = false;
    new Complaint(Item).save().then((service) => {
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


// $routes GET /complaint/service/getClass
// @desc 获取稿件投诉类别
// @access private
router.get('/getClass', (req, res) => {
    ComplaintClass.find().then(msg => {
        res.json({
            type: 'Success',
            complaintClass: msg
        })
    }).catch(err => {
        res.json({
            type: 'err'
        })
    })
})
module.exports = router;