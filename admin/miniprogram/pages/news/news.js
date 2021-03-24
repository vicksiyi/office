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
    let result = await this.getNews(1);
    console.log(result)
    wx.getSystemInfo({
      success: (result) => {
        _this.setData({
          height: result.windowHeight
        })
      },
    })
    this.setData({
      news: result.data.items
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
        url: `http://${app.ip}:5001/admin/news/getNews/${page}`,
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
            resolve(res.data.data);
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
    resource.push(...data.data.items)
    if (data.data.items == 0) {
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
      let detail = e.currentTarget.dataset.detail;
      wx.request({
        url: `http://${app.ip}:5001/admin/news/addNews`,
        method: 'POST',
        data: {
          title: detail.title,
          imageUrl: detail.thumbnails.image[0].url,
          newsUrl: detail.url,
          from: detail.source
        },
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
              content: '成功推送',
              type: 'success'
            })
          }
          if (res.data.type == 'added') {
            $Message({
              content: '已经推送',
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
  nav:function(){
    wx.navigateTo({
      url: '../../pages/newsList/newsList',
    })
  }
})