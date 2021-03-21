//login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');
const CustomerService = require('../../models/CustomerService');

// $routes GET /admin/answer/getAnswer
// @desc 获取反馈
// @access private
router.get('/getAnswer/:start', passport.authenticate('jwt', { session: false }), (req, res) => {
    CustomerService.aggregate([
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
        for (let i = 0; i < result.length; i++) {
            let temp = {};
            temp.avatarUrl = result[i].user.avatarUrl;
            temp.nickName = result[i].user.nickName;
            result[i].user = temp;
        }
        res.json({
            type: 'Success',
            answer: result
        });
    });
})


// $routes GET /admin/answer/searchAnswer
// @desc 搜索
// @access private
router.get('/searchAnswer/:keyword/:start', passport.authenticate('jwt', { session: false }), (req, res) => {
    const keyword = new RegExp(req.params.keyword);
    CustomerService.find({ msg: keyword }).sort({ time: -1 }).skip(req.params.start * 10).limit(10).then(Msg => {
        res.json({
            type: 'Success',
            answer: Msg
        });
    }).catch(err => {
        res.json(err);
    })
})

module.exports = router;