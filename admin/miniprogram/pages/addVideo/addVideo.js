const { $Message } = require('../../dist/base/index');
var time = null;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    title: '',
    seriseVideo: [],
    video: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let title = options.title;
    let type = options.type;
    wx.setNavigationBarTitle({
      title: title,
    })
    this.setData({
      type: type,
      title: title,
    })
  },
  onShow: async function () {
    let token = await wx.getStorageSync('Token');
    let seriseVideo = await this.getSeriesVideo(token, this.data.type, 0);
    this.setData({
      token: token,
      seriseVideo: seriseVideo
    })
  },
  nav: function () {
    wx.navigateTo({
      url: `../add/add?type=${this.data.type}`,
    })
  },
  getSeriesVideo: function (token, type, start) {
    let _this = this;
    wx.showLoading({
      title: '加载数据',
      mask: true
    })
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://${app.ip}:5001/admin/video/getSeriesVideo/${type}/${start}`,
        header: {
          'Authorization': token
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
          if (res.data.type != 'err') {
            resolve(res.data)
          }
        },
        fail: function (err) {
          reject(err);
        },
        complete: () => {
          wx.hideLoading()
        }
      })
    })
  },
  show: function (e) {
    let video = e.currentTarget.dataset.video;
    this.setData({
      video: video,
      isShow: true
    })
  },
  hideShow: function () {
    this.setData({
      isShow: false
    })
  },
  del: function (e) {
    let _this = this;
    let id = e.currentTarget.dataset.id;
    wx.showLoading({
      title: '加载数据',
      mask: true
    })
    wx.request({
      url: `http://${app.ip}:5001/admin/video/delSeriesVideo/${id}`,
      header: {
        'Authorization': _this.data.token
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
        if (res.data.type != 'err') {
          $Message({
            content: '成功',
            type: 'success'
          })
          let seriseVideo = await _this.getSeriesVideo(_this.data.token, _this.data.type, 0);
          _this.setData({
            seriseVideo: seriseVideo
          })
        }
      },
      fail: function (err) {
        reject(err);
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  }
})