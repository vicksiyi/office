//login & register
const express = require('express');
const passport = require('passport');
const router = express.Router();
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
                    type: 'Success'
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

module.exports = router;