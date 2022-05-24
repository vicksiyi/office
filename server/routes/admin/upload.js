const express = require('express');
const router = express.Router();
var multer = require('multer')
var uploadImage = multer({ dest: 'uploads/' })
var uploadVideo = multer({ dest: 'video/' })
var uploadPPT = multer({ dest: 'ppt/' })
const path = require('path');
const fs = require('fs');
const libre = require('libreoffice-convert');


// $routes /upload/image
// @desc 上传图片
// @access prublic
router.post('/image', uploadImage.single('avatar'), function (req, res, next) {
    // req.file 是 `avatar` 文件的信息
    // req.body 将具有文本域数据，如果存在的话
    let file = req.file
    //获取后缀名
    const extname = path.extname(file.originalname)
    //获取上传成功之后的文件路径
    const filepath = file.path
    //上传之后文件的名称
    const filename = filepath + extname
    fs.rename(filepath, filename, err => {
        res.json({
            type: 'success',
            img: file.filename + extname
        })
    })
})

// $routes /upload/video
// @desc 上传视频
// @access prublic
router.post('/video', uploadVideo.single('video'), function (req, res, next) {
    // req.file 是 `avatar` 文件的信息
    // req.body 将具有文本域数据，如果存在的话
    let file = req.file
    //获取后缀名
    const extname = path.extname(file.originalname)
    //获取上传成功之后的文件路径
    const filepath = file.path
    //上传之后文件的名称
    const filename = filepath + extname
    fs.rename(filepath, filename, err => {
        res.json({
            type: 'success',
            url: file.filename + extname
        })
    })
})
module.exports = router;