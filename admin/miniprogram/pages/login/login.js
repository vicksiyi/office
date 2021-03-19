const app = getApp();
const { $Message } = require('../../dist/base/index');
var time = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value1: 'admin',
    value2: 'admin'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  value1Change: function (e) {
    this.setData({
      value1: e.detail.detail.value
    })
  },
  value1Change: function (e) {
    this.setData({
      value2: e.detail.detail.value
    })
  },
  oauth: function () {
    let _this = this;
    wx.showLoading({
      title: '登录ing',
      mask: true
    })
    wx.request({
      url: `http://${app.ip}:5001/admin/service/login`,
      method: 'POST',
      data: {
        name: _this.data.value1,
        password: _this.data.value2
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      success: async function (res) {
        if (res.data.type == "Success") {
          $Message({
            content: '成功',
            type: 'success'
          })
          wx.setStorage({
            key: "Token",
            data: res.data.token
          })
          time = setTimeout(() => {
            wx.switchTab({
              url: '../index/index',
            })
            wx.hideLoading();
            clearTimeout(time);
          }, 1000)
        }
        if (res.data.type == 'error') {
          $Message({
            content: '账号或者密码错误',
            type: 'error'
          })
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  onUnload: function () {
    clearTimeout(time);
  }
})