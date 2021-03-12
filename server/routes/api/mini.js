//login & register
const express = require('express');
const router = express.Router();

// $routes GET /api/mini/test
// @desc 测试
// @access public
router.get('/test', (req, res) => {
    res.json({
        msg: '成功'
    })
})


module.exports = router;