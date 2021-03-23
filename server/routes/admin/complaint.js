//login & register
const express = require('express');
const passport = require('passport');
const router = express.Router();
const mongoose = require('mongoose');
const Complaint = require('../../models/Complaint');
const ComplaintClass = require('../../models/ComplaintClass');

// $routes GET /admin/complaint/addClass
// @desc 添加稿件投诉类别
// @access private
router.post('/addClass', passport.authenticate('jwt', { session: false }), (req, res) => {
    let Item = {};
    Item.title = req.body.title;
    ComplaintClass.findOne(Item).then(result => {
        if (result) {
            res.json({
                type: 'added'
            })
        } else {
            new ComplaintClass(Item).save().then(msg => {
                res.json({
                    type: 'Success',
                    msg: msg
                })
            }).catch(err => {
                res.json({
                    type: 'err'
                })
            })
        }
    }).catch(err => {
        res.json({
            type: 'err'
        })
    })
})


// $routes GET /admin/complaint/getClass
// @desc 获取稿件投诉类别
// @access private
router.get('/getClass', passport.authenticate('jwt', { session: false }), (req, res) => {
    let Item = {};
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

// $routes GET /admin/complaint/delClass
// @desc 删除投诉类别（需要删掉相关投诉的内容）
// @access private
router.post('/delClass', passport.authenticate('jwt', { session: false }), (req, res) => {
    Complaint.remove({
        classId: req.body.id
    }).then(result => {
        ComplaintClass.findOneAndRemove({
            _id: mongoose.Types.ObjectId(req.body.id).toString()
        }).then(msg => {
            res.json({
                type: 'Success'
            })
        }).catch(err => {
            res.json({
                type: 'err'
            })
        }).catch(err => {
            res.json({
                type: 'err'
            })
        })
    }).catch(err => {
        console.log(err)
        res.json({
            type: 'err'
        })
    })
})
module.exports = router;