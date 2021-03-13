const { $Message } = require('../../dist/base/index');
const base64 = require('../../utils/base64');
const getUser = require('../../utils/getUser');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maxNumber: 400,//可输入最大字数
    number: 0,//已输入字数
    uploadImage: '',
    tag: ['Office', 'Word'],
    inputValue: '',
    uploadVideo: '',
    duration: '',
    msg: ''
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
  send: function () {
    let title = this.data.title;
    let uploadVideo = this.data.uploadVideo;
    let uploadImage = this.data.uploadImage;
    let classVideo = this.data.classVideo;
    let msg = this.data.msg;
    let tag = this.data.tag;
    console.log({
      title, uploadImage, uploadVideo,
      classVideo,
      msg, tag
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