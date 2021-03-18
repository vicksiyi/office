const app = getApp()
const getUser = require('../../utils/getUser');
const formatTime = require('../../utils/formatTime');
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    spinShow: false,
    start: 0,
    record: [],
    height: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let _this = this;
    let result = await this.getRecord(0);
    this.setData({
      record: result
    })
    wx.getSystemInfo({
      success: (result) => {
        _this.setData({
          height: result.windowHeight
        })
      },
    })
  },
  getRecord: async function (start) {
    let _this = this;
    this.setData({
      spinShow: true
    })
    let token = await getUser.getUserToken()
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://${app.ip}:5000/exam/exam/getExam/${start}`,
        method: 'GET',
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
          _this.setData({
            spinShow: false
          })
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].time = formatTime.changeTime(res.data[i].time);
          }
          resolve(res.data);
        },
        fail: function (err) {
          reject(err);
        }
      })
    }).catch((err) => {
      wx.switchTab({
        url: '../../pages/auth/auth',
      })
    })
  },
  tolower: async function () {
    let _this = this;
    let start = this.data.start + 1;
    let data = await this.getRecord(start);
    let resource = this.data.record;
    resource.push(...data)
    if (data.length == 0) {
      $Message({
        content: '底线到了...',
        type: 'warning'
      })
      return;
    }
    this.setData({
      record: resource,
      start: start
    })
  },
  nav: function (e) {
    if (e.currentTarget.dataset.type == 0) {
      wx.navigateTo({
        url: `../../pages/radioDetail/radioDetail?detail=${JSON.stringify(this.data.record[e.currentTarget.dataset.index])}`,
      })
    } else {
      wx.navigateTo({
        url: `../../pages/multiSelectDetail/multiSelectDetail?detail=${JSON.stringify(this.data.record[e.currentTarget.dataset.index])}`,
      })
    }
  }
})