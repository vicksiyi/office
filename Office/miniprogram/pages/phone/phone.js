const app = getApp()
const getUser = require('../../utils/getUser');
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    time: 60,
    value1: '',
    value2: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  send: async function () {
    let _this = this;
    this.setData({
      disabled: true
    })
    let token = await getUser.getUserToken()
    wx.request({
      url: `http://${app.ip}:5000/user/modify/sendPhone`,
      data: {
        phone: this.data.value1
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token
      },
      success: async function (res) {
        if (res.data == "Unauthorized") {
          wx.removeStorage({
            key: 'Token',
          })
          wx.redirectTo({
            url: '../../pages/auth/auth',
          })
        }
        if (res.data.msg == 'Success') {
          $Message({
            content: '发送成功',
            type: 'success'
          })
        }
      },
      fail: function (err) {
        reject(err);
      }
    })
    let setTime = setInterval(() => {
      if (this.data.time == 0) {
        clearInterval(setTime);
        _this.setData({
          time: 60,
          disabled: false
        })
        return;
      }
      _this.setData({
        time: this.data.time - 1
      })
    }, 1000);
  },
  submit: async function () {
    let token = await getUser.getUserToken()
    wx.request({
      url: `http://${app.ip}:5000/user/modify/oauthPhone`,
      data: {
        phone: this.data.value1,
        code: this.data.value2
      },
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token
      },
      success: async function (res) {
        if (res.data == "Unauthorized") {
          wx.removeStorage({
            key: 'Token',
          })
          wx.redirectTo({
            url: '../../pages/auth/auth',
          })
        }
        if (res.data.type == 'success') {
          $Message({
            content: '修改手机号成功',
            type: 'success'
          })
          let setOauth = setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
            clearTimeout(setOauth)
          }, 1000)
        } else {
          $Message({
            content: '验证码错误',
            type: 'error'
          })
        }
      },
      fail: function (err) {
        reject(err);
      }
    })
  },
  value1Change: function (e) {
    this.setData({
      value1: e.detail.detail.value
    })
  },
  value2Change: function (e) {
    this.setData({
      value2: e.detail.detail.value
    })
  },
  onUnload: function () {
    clearInterval(setTime);
    clearTimeout(setOauth);
  }
})