//index.js
const app = getApp()
const getUser = require('../../utils/getUser');
const formatTime = require('../../utils/formatTime');
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    video: [],
    start: 0,
    spinShow: false,
    inputValue: '',
    token: '',
    show: false,
    lastNotice: '',
    notice: {},
    isShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: async function (options) {
    let _this = this
    this.setData({
      load: true
    })
    wx.getSystemInfo({
      success: (result) => {
        _this.setData({
          height: result.windowHeight - 50
        })
      },
    })
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    let data = await this.getVideo(0);
    let token = await getUser.getUserToken();
    this.getLastNotice(token);
    _this.setData({
      video: data,
      start: 0
    })
  },
  nav: function (e) {
    wx.navigateTo({
      url: `../video/video?_id=${e.currentTarget.dataset.id}`,
    })
  },
  getVideo: async function (start) {
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
        url: `http://${app.ip}:5000/send/video/getVideo/${start}`,
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
          for (let i = 0; i < res.data.length; ++i) { // cloud转temp
            res.data[i].imageUrl = await getUser.getTempUrl(res.data[i].imageUrl);
            res.data[i].imageUrl = res.data[i].imageUrl[0].tempFileURL;
            res.data[i].videoTime = formatTime.secondsFormat(res.data[i].videoTime);
          }
          _this.setData({
            spinShow: false
          })
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
  tolower: async function (e) {
    let _this = this;
    let start = this.data.start + 1;
    let data = [];
    if (this.data.inputValue) {
      data = await this.search(start, this.data.inputValue);
    } else {
      data = await this.getVideo(start);
    }
    let resource = this.data.video;
    resource.push(...data)
    if (data.length == 0) {
      $Message({
        content: '底线到了...',
        type: 'warning'
      })
      return;
    }
    this.setData({
      video: resource,
      start: start
    })
  },
  inputChange: function (e) {
    this.setData({
      inputValue: e.detail.detail.value
    })
  },
  searchTitle: async function () {
    let result = await this.search(0, this.data.inputValue);
    this.setData({
      video: result,
      start: 0
    })
  },
  search: function (start, inputValue) {
    let _this = this;
    this.setData({
      spinShow: true
    })
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://${app.ip}:5000/send/video/searchVideo/${start}?title=${inputValue}`,
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': this.data.token
        },
        success: async function (res) {
          for (let i = 0; i < res.data.length; ++i) { // cloud转temp
            res.data[i].imageUrl = await getUser.getTempUrl(res.data[i].imageUrl);
            res.data[i].imageUrl = res.data[i].imageUrl[0].tempFileURL
          }
          _this.setData({
            spinShow: false
          })
          resolve(res.data);
        },
        fail: function (err) {
          reject(err);
        }
      })
    })
  },
  closeIcon: function () {
    let _this = this;
    console.log('关闭')
    wx.request({
      url: `http://${app.ip}:5000/user/notice/add`,
      method: 'POST',
      data: {
        msgId: this.data.notice._id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': this.data.token
      },
      success: async function (res) {
        if (res.data.type == 'Success') {
          $Message({
            content: '成功收到公告',
            type: 'success'
          })
        }
      },
      fail: function (err) {
        reject(err);
      }
    })
  },
  getLastNotice: function (token) {
    let _this = this;
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://${app.ip}:5000/user/notice/getLastNotice`,
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': token
        },
        success: async function (res) {
          if (res.data.type == 'Success') {
            _this.setData({
              lastNotice: res.data.data.msg,
              notice: res.data.data,
              isShow: true
            })
          }
          if (res.data.type == 'added') {
            _this.setData({
              isShow: false
            })
          }
        },
        fail: function (err) {
          reject(err);
        }
      })
    })
  },
  show: function () {
    this.setData({
      show: !this.data.show
    })
  }
})