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
    answer: [],
    height: 0,
    start: 0,
    showRight: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let _this = this;
    let answer = await this.getAnswer(0);
    wx.getSystemInfo({
      success: (result) => {
        _this.setData({
          height: result.windowHeight
        })
      },
    })
    this.setData({
      answer: answer
    })
  },
  getAnswer: async function (start) {
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
        url: `http://${app.ip}:5001/admin/answer/getAnswer/${start}`,
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
            for (let i = 0; i < res.data.answer.length; i++) {
              res.data.answer[i].time = formatTime.changeTime(res.data.answer[i].time);
              res.data.answer[i].imageList = res.data.answer[i].imageList.split(';');
            }
            resolve(res.data.answer);
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
    let data = await this.getAnswer(start);
    let resource = this.data.answer;
    resource.push(...data)
    if (data.length == 0) {
      $Message({
        content: '底线到了...',
        type: 'warning'
      })
      return;
    }
    this.setData({
      answer: resource,
      start: start
    })
  },
  toggleRight: function (e) {
    this.setData({
      showRight: !this.data.showRight,
      imageList: e.currentTarget.dataset.imagelist
    })
  },
  showImage: function (e) {
    let url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url,
      urls: [url]
    })
  }
})