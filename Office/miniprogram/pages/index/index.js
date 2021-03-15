//index.js
const app = getApp()
const getUser = require('../../utils/getUser');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'video',
    load: false,
    height: 0,
    data: {
      "video": [],
      "eaxm": []
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let _this = this
    this.setData({
      load: true
    })
    wx.getSystemInfo({
      success: (result) => {
        _this.setData({
          height: result.windowHeight - 42
        })
      },
    })
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    let token = await getUser.getUserToken()
    try {
      wx.request({
        url: `http://${app.ip}:5000/send/video/getVideo/0`,
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': token
        },
        success: async function (res) {
          let temp = 'data.video'
          // res.data.forEach(async (value, key) => {
          //   value.imageUrl = await getUser.getTempUrl(value.imageUrl);
          //   value.imageUrl = value.imageUrl[0].tempFileURL
          // })
          if (res.data == "Unauthorized") {
            wx.removeStorage({
              key: 'Token',
            })
            wx.redirectTo({
              url: '../../pages/auth/auth',
            })
          }
          for (let i = 0; i < res.data.length; ++i) { // cloud转temp
            res.data[i].imageUrl = await getUser.getTempUrl(res.data[i].imageUrl);
            res.data[i].imageUrl = res.data[i].imageUrl[0].tempFileURL
            // console.log(res.data[i].imageUrl)
          }
          _this.setData({
            [temp]: res.data,
            load: false
          })
        },
        fail: function (err) {
          console.log(err)
        }
      })
    } catch {
      wx.switchTab({
        url: '../../pages/auth/auth',
      })
    }
  },
  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
  },
  nav: function (e) {
    wx.navigateTo({
      url: '../video/video?id=',
    })
  }
})