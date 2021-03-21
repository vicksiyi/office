//login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Notice = require('../../models/Notice');
const NoticeLog = require('../../models/NoticeLog');

// $routes GET /admin/notice/add
// @desc 发布公告
// @access private
router.post('/add', passport.authenticate('jwt', { session: false }), (req, res) => {
    let Item = {};
    Item.adminId = req.user._id
    Item.msg = req.body.msg;
    new Notice(Item).save().then(() => {
        res.json({
            type: 'Success'
        });
    }).catch(err => {
        console.log(err)
        res.json({
            type: 'err'
        });
    })
})

module.exports = router;