const { $Message } = require('../../dist/base/index');
var time = null;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '视频测试',
    num: 0,
    video: '',
    type: 0,
    token: '',
    img: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let type = options.type;
    let token = await wx.getStorageSync('Token')
    this.setData({
      type: type,
      token: token
    })
  },
  inputChange: function (e) {
    this.setData({
      title: e.detail.detail.value
    })
  },
  upload: function () {
    let _this = this;
    wx.showLoading({
      title: '正在打开',
      mask: true
    })
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      success(res) {
        wx.showLoading({
          title: '正在上传',
          mask: true
        })
        wx.uploadFile({
          filePath: res.thumbTempFilePath,
          name: 'avatar',
          url: `http://${app.tempIp}:${app.port}/upload/image`,
          success(res) {
            let baseUrl = app.baseUrl;
            let data = JSON.parse(res.data)
            _this.setData({
              img: baseUrl + data.img,
            })
          }
        })
        let uploadTask = wx.uploadFile({
          url: `http://${app.tempIp}:${app.port}/upload/video`,
          filePath: res.tempFilePath,
          name: 'video',
          success(res) {
            let baseUrl = app.baseVideoUrl;
            let data = JSON.parse(res.data)
            _this.setData({
              num: 0,
              video: baseUrl + data.url,
              isVideo: true
            })
          },
          complete: function () {
            wx.hideLoading();
          }
        })
        uploadTask.onProgressUpdate((res) => {
          _this.setData({
            num: res.progress
          })
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  submit: function () {
    let _this = this;
    let type = this.data.type;
    let title = this.data.title;
    let videoUrl = this.data.video
    let img = this.data.img;
    wx.showLoading({
      title: '正在上传',
      mask: true
    })
    wx.request({
      url: `http://${app.ip}:5001/admin/video/seriesVideo`,
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': _this.data.token
      },
      data: {
        type: type,
        title: title,
        videoUrl: videoUrl,
        img: img
      },
      success: async function (res) {
        if (res.data == "Unauthorized") {
          wx.removeStorage({
            key: 'Token',
          })
          wx.redirectTo({
            url: '../../pages/login/login',
          })
        }
        if (res.data.type == 'Success') {
          $Message({
            content: '成功上传',
            type: 'success'
          })
          time = setTimeout(() => {
            wx.navigateBack({
              delta: 1,
            })
            clearTimeout(time);
            wx.hideLoading()
          }, 1000);
        } else {
          $Message({
            content: '上传出错',
            type: 'error'
          })
          wx.hideLoading()
        }
      },
      fail: function (err) {
        reject(err);
      }
    })
  }
})