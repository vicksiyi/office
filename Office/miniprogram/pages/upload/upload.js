const { $Message } = require('../../dist/base/index');
const base64 = require('../../utils/base64');
const getUser = require('../../utils/getUser');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maxNumber: 400,//可输入最大字数
    number: 0,//已输入字数
    uploadImage: '',
    tag: [],
    inputValue: '',
    uploadVideo: '',
    duration: '',
    msg: '',
    title: '',
    classVideo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  inputText: function (e) {
    let _this = this;
    let value = e.detail.value;
    let len = value.length;
    this.setData({
      'msg': value
    })
    if (len > this.data.maxNumber) {
      _this.setData({
        'number': this.data.maxNumber
      })
      return;
    }
    this.setData({
      'number': len
    })
  },
  addTag: function () {
    if (!this.data.inputValue) {
      $Message({
        content: '不可为空',
        type: 'warning'
      });
      return;
    }
    let tag = this.data.tag;
    tag.push(this.data.inputValue);
    this.setData({
      inputValue: '',
      tag: tag
    })
  },
  inputChange: function (res) {
    this.setData({
      inputValue: res.detail.detail.value
    })
  },
  uploadImage: function (res) {
    let _this = this;
    wx.showLoading({
      title: '上传中...',
      mask: true
    })
    wx.chooseImage({
      count: 1,
      success(res) {
        console.log(res)
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          async success(res) {
            console.log(res.path)
            let userInfo = await getUser.getUserInfo();
            userInfo = JSON.parse(userInfo);
            wx.cloud.uploadFile({
              cloudPath: `image/${Date.parse(new Date()) + base64.encode(userInfo.nickName)}.png`, // 上传至云端的路径
              filePath: res.path, // 小程序临时文件路径
              success: res2 => {
                // 返回文件 ID
                _this.setData({
                  uploadImage: res2.fileID
                })
                wx.hideLoading()
              },
              fail: console.error
            })
            // wx.getFileSystemManager().readFile({
            //   filePath: res.path,
            //   encoding: 'base64',
            //   success: function (res) {
            //     wx.cloud.callFunction({
            //       name: 'uploadImageFile',
            //       data: {
            //         path: `image/${Date.parse(new Date()) + base64.encode(userInfo.nickName)}.png`,
            //         file: res.data
            //       },
            //       success(_res) {
            //         _this.setData({
            //           uploadImage: _res.result.fileID
            //         })
            //         console.log(_res.result.fileID)
            //         $Message({
            //           content: '上传封面成功',
            //           type: 'success'
            //         })
            //         wx.hideLoading()
            //       }, fail(_res) {
            //         console.log(_res)
            //         wx.hideLoading()
            //       }
            //     })
            //   }
            // })
          }
        })
      },
      fail: function (err) {
        console.log(err)
        $Message({
          content: '用户取消',
          type: 'warning'
        })
        wx.hideLoading()
      }
    })
  },
  uploadVideo: function () {
    let _this = this;
    wx.showLoading({
      title: '上传中...',
      mask: true
    })
    wx.chooseVideo({
      count: 1,
      success: async function (res) {
        console.log(res.tempFilePath)
        let userInfo = await getUser.getUserInfo();
        userInfo = JSON.parse(userInfo);
        if (res.size > 52428800) {
          $Message({
            content: '文件不能超过50M',
            type: 'warning'
          })
          wx.hideLoading()
          return;
        }
        wx.cloud.uploadFile({
          cloudPath: `video/${Date.parse(new Date()) + base64.encode(userInfo.nickName)}.mp4`, // 上传至云端的路径
          filePath: res.tempFilePath, // 小程序临时文件路径
          success: res2 => {
            // 返回文件 ID
            _this.setData({
              uploadVideo: res2.fileID,
              duration: res.duration
            })
            wx.hideLoading()
          },
          fail: console.error
        })
      },
      fail: function () {
        $Message({
          content: '用户取消',
          type: 'warning'
        })
        wx.hideLoading()
      }
    })
  },
  send: async function () {
    let title = this.data.title;
    let uploadVideo = this.data.uploadVideo;
    let uploadImage = this.data.uploadImage;
    let classVideo = this.data.classVideo;
    let time = this.data.duration;
    let msg = this.data.msg;
    let tag = this.data.tag;
    wx.showLoading({
      title: '发布中...',
      mask: true
    })
    if (!title || !uploadVideo || !uploadImage || !classVideo || !msg || !tag.length) {
      $Message({
        content: '还有字段没填写完',
        type: 'warning'
      })
      return;
    }
    var temp = ''
    tag.forEach((value, key) => {
      temp += (key != tag.length - 1) ? value + ';' : value;
    })
    tag = temp;
    let token = await getUser.getUserToken()
    wx.request({
      url: `http://${app.ip}:5000/send/video/upload`,
      method: 'POST',
      data: { title, title, uploadVideo, uploadImage, classVideo, msg, tag, time },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token
      },
      success: function (res) {
        if (res.data.msg == 'Success') {
          $Message({
            content: '上传成功',
            type: 'success'
          })
          let setTimeTemp = setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            })
            clearTimeout(setTimeTemp)
            wx.hideLoading();
          }, 1000)
        }
      }
    })
  },
  classChange: function (res) {
    this.setData({
      classVideo: res.detail.detail.value
    })
  },
  titleChange: function (res) {
    this.setData({
      title: res.detail.detail.value
    })
  }
})