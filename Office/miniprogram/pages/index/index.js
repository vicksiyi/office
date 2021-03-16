//index.js
const app = getApp()
const getUser = require('../../utils/getUser');
const { $Message } = require('../../dist/base/index');
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
    },
    start: 0,
    spinShow: false
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
    let data = await this.getVideo(this.data.start);
    let temp = 'data.video'
    _this.setData({
      [temp]: data
    })
  },
  async handleChange({ detail }) {
    let _this = this;
    _this.setData({
      start: 0
    })
    if (detail.key == 'video') {
      let data = await this.getVideo(0);
      let temp = 'data.video'
      _this.setData({
        [temp]: data
      })
    }
    this.setData({
      current: detail.key
    });
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
    }).catch((err) => {
      wx.switchTab({
        url: '../../pages/auth/auth',
      })
    })
  },
  tolower: async function (e) {
    let _this = this;
    let start = this.data.start + 1;
    let data = await this.getVideo(start);
    let resource = this.data.data.video;
    let temp = 'data.video';
    resource.push(...data)
    if (data.length == 0) {
      $Message({
        content: '底线到了...',
        type: 'warning'
      })
      return;
    }
    this.setData({
      [temp]: resource,
      start: start
    })
  }
})