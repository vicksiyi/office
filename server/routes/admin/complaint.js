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


// $routes GET /admin/complaint/getComplaint
// @desc 获取稿件
// @access private
router.get('/getComplaint/:start', passport.authenticate('jwt', { session: false }), (req, res) => {
    Complaint.aggregate([
        { $match: { isDone: false } },
        {
            $lookup: {
                from: "users",
                localField: "openId",
                foreignField: "openId",
                as: "user"
            }
        },
        { $unwind: "$user" },
        { $sort: { time: -1 } },
        { $skip: req.params.start * 10 },
        { $limit: 10 }
    ]).exec(function (err, result) {
        console.log(result);
        for (let i = 0; i < result.length; i++) {
            let temp = {};
            temp.avatarUrl = result[i].user.avatarUrl;
            temp.nickName = result[i].user.nickName;
            result[i].user = temp;
        }
        res.json({
            type: 'Success',
            complaint: result
        });
    });
})

// $routes GET /admin/complaint/modifyComplaint
// @desc 处理完成稿件
// @access private
router.get('/modifyComplaint/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    let Item = {};
    Item.isDone = true;
    Complaint.findOneAndUpdate({ _id: req.params.id }, { $set: Item }, { new: true }).then(result => {
        res.json({
            type: 'Success'
        })
    }).catch(err => {
        res.json({
            type: 'error'
        })
    })
})
module.exports = router;