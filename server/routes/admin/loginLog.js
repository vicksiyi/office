//login & register
const express = require('express');
const passport = require('passport');
const router = express.Router();
const LoginLog = require('../../models/LoginLog');

// $routes GET /admin/loginLog/getLog
// @desc 获取日志
// @access private
router.get('/getLog/:start', passport.authenticate('jwt', { session: false }), (req, res) => {
    LoginLog.aggregate([
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
        let temp = [];
        for (let i = 0; i < result.length; i++) {
            temp.push({
                openId: result[i].openId,
                avatarUrl: result[i].user.avatarUrl,
                nickName: result[i].user.nickName,
                type: result[i].type,
                ip: result[i].ip,
                time: result[i].time,
                model: result[i].model,
                system: result[i].system,
                _id: result[i]._id
            })
        }
        res.json({
            type: 'Success',
            data: temp
        })
    });
})

module.exports = router;