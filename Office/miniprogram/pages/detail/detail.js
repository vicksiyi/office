const app = getApp()
const getUser = require('../../utils/getUser');
const { $Message } = require('../../dist/base/index');
var navSetTime = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentHeight: 0,
    userDetail: {},
    spinShow: false,
    start: 0,
    video: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(options)
    let _this = this;
    this.setData({
      openId: options.openId
    })
    wx.setNavigationBarTitle({
      title: options.nickName
    })
    let result = await this.getVideo(this.data.start, options.openId);
    this.setData({
      video: result
    })
    this.getUserDetail(options.openId);
    var query = wx.createSelectorQuery();
    wx.getSystemInfo({
      success: (result) => {
        console.log(result.windowHeight)
        query.select(
          '.header').boundingClientRect(
            function (rect) {
              _this.setData({
                contentHeight: result.windowHeight - rect.height
              })
            }
          ).exec();
      }
    })
  },
  getUserDetail: async function (openId) {
    let _this = this;
    let token = await getUser.getUserToken()
    wx.request({
      url: `http://${app.ip}:5000/user/focus/userDetail`,
      method: 'POST',
      data: {
        openId: openId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token
      },
      success: function (res) {
        _this.setData({
          userDetail: res.data
        })
      }
    })
  },
  getVideo: async function (start, openId) {
    let _this = this;
    this.setData({
      spinShow: true
    })
    let token = await getUser.getUserToken()
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://${app.ip}:5000/send/video/getUserVideo/${start}`,
        method: 'GET',
        data: {
          openId: openId
        },
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
          if (res.data.type == "Success") {
            resolve(res.data.res);
          }
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
  nav: function (e) {
    wx.navigateTo({
      url: `../../pages/video/video?_id=${e.currentTarget.dataset.id}`,
      fail: function (err) {
        $Message({
          content: '循环跳转太多次',
          type: 'warning'
        })
        navSetTime = setTimeout(() => {
          clearTimeout(navSetTime);
          wx.navigateBack({
            delta: 10,
          })
        }, 1000)
      }
    })
  },
  onUnload: function () {
    clearTimeout(navSetTime);
  }
})