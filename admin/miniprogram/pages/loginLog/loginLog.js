const app = getApp();
const getUser = require('../../utils/getUser');
const { $Message } = require('../../dist/base/index');
const formatTime = require('../../utils/formatTime');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    spinShow: false,
    token: '',
    start: 0,
    log: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let _this = this;
    let result = await this.getLog(0);
    this.setData({
      log: result
    })
    wx.getSystemInfo({
      success: (result) => {
        _this.setData({
          height: result.windowHeight
        })
      },
    })
  },
  getLog: async function (start) {
    let _this = this;
    this.setData({
      spinShow: true
    })
    let token = await getUser.getUserToken()
    this.setData({
      token: token
    })
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://${app.ip}:5001/admin/loginLog/getLog/${start}`,
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
              url: '../../pages/login/login',
            })
          }
          _this.setData({
            spinShow: false
          })
          if (res.data.type == 'Success') {
            for (let i = 0; i < res.data.data.length; i++) {
              res.data.data[i].time = formatTime.changeTime(res.data.data[i].time);
            }
            resolve(res.data.data);
          }
        },
        fail: function (err) {
          reject(err);
        }
      })
    }).catch((err) => {
      wx.switchTab({
        url: '../../pages/login/login',
      })
    })
  },
  tolower: async function () {
    let _this = this;
    let start = this.data.start + 1;
    let data = await this.getLog(start);
    let resource = this.data.log;
    resource.push(...data)
    if (data.length == 0) {
      $Message({
        content: '底线到了...',
        type: 'warning'
      })
      return;
    }
    this.setData({
      log: resource,
      start: start
    })
  }
})