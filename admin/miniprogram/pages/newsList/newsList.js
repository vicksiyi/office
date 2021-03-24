const app = getApp()
const getUser = require('../../utils/getUser');
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    news: [],
    height: 0,
    start: 0,
    spinShow: false,
    timeStamp: 0,
    token: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let _this = this;
    let result = await this.getNews(0);
    console.log(result)
    wx.getSystemInfo({
      success: (result) => {
        _this.setData({
          height: result.windowHeight
        })
      },
    })
    this.setData({
      news: result
    });
  },
  getNews: async function (page) {
    let _this = this;
    let token = await getUser.getUserToken();
    _this.setData({
      spinShow: true,
      token: token
    })
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://${app.ip}:5001/admin/news/getDoneNews/${page}`,
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
          if (res.data.type == 'Success') {
            _this.setData({
              spinShow: false
            })
            resolve(res.data.msg);
          }
        },
        fail: function (err) {
          reject(err);
        }
      })
    })
  },
  tolower: async function (e) {
    let _this = this;
    let start = this.data.start + 1;
    let data = [];
    data = await this.getNews(start);
    let resource = this.data.news;
    resource.push(...data)
    if (data.length == 0) {
      $Message({
        content: '底线到了...',
        type: 'warning'
      })
      return;
    }
    this.setData({
      news: resource,
      start: start
    })
  },
  doubleClick: function (e) {
    let _this = this;
    if (this.data.timeStamp == 0) {
      _this.setData({
        timeStamp: e.timeStamp
      })
      return;
    }
    if (e.timeStamp - this.data.timeStamp < 300) {
      let id = e.currentTarget.dataset.id;
      let index = e.currentTarget.dataset.index;
      wx.request({
        url: `http://${app.ip}:5001/admin/news/delNews/${id}`,
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
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
          if (res.data.type == 'Success') {
            $Message({
              content: '成功删除',
              type: 'success'
            })
            let news = _this.data.news;
            news.splice(index, 1);
            _this.setData({
              news: news
            })
          }
          if (res.data.type == 'deled') {
            $Message({
              content: '已经删除',
              type: 'warning'
            })
          }
        },
        fail: function (err) {
          reject(err);
        }
      })
    }
    this.setData({
      timeStamp: 0
    })
  },
  nav: function () {
    wx.navigateTo({
      url: '../../pages/newsList/newsList',
    })
  }
})