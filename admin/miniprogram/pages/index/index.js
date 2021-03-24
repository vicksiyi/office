//index.js
const app = getApp()
const getUser = require('../../utils/getUser');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardList: [
      {
        'title': '视频管理',
        'logo': '../../images/index/video.png',
        'nav': '../video/video'
      },
      {
        'title': '用户管理',
        'logo': '../../images/index/user.png',
        'nav': '../user/user'
      },
      {
        'title': '登录日志',
        'logo': '../../images/index/loginLog.png',
        'nav': '../loginLog/loginLog'
      },
      {
        'title': '公告管理',
        'logo': '../../images/index/display.png',
        'nav': '../display/display'
      },
      {
        'title': '反馈管理',
        'logo': '../../images/index/answer.png',
        'nav': '../answer/answer'
      },
      {
        'title': '稿件管理',
        'logo': '../../images/index/complain.png',
        'nav': '../complain/complain'
      },
      {
        'title': '新闻推送',
        'logo': '../../images/index/news.png',
        'nav': '../news/news'
      },
      {
        'title': '系列视频',
        'logo': '../../images/index/videoList.png',
        'nav': '../videoList/videoList'
      },
      {
        'title': '刷题管理',
        'logo': '../../images/index/exam.png',
        'nav': '../exam/exam'
      }
    ],
    userNum: 0,
    spinShow: false,
    dayUserNum: 0,
    dayLogNum: 0,
    registerNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.setData({
      spinShow: true
    })
    let token = await getUser.getUserToken()
    let getUserNum = await this.getUserNum(token);
    let getDayUserNum = await this.getDayUserNum(token);
    let getDayLogNum = await this.getDayLogNum(token);
    let registerNum = await this.getRegisterNum(token);
    this.setData({
      userNum: getUserNum.num,
      dayUserNum: getDayUserNum,
      dayLogNum: getDayLogNum,
      registerNum: registerNum,
      spinShow: false
    })
  },
  nav: function (res) {
    wx.navigateTo({
      url: `${this.data.cardList[res.currentTarget.dataset.id].nav}`
    })
  },
  getUserNum: async function (token) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://${app.ip}:5001/admin/user/getNum`,
        method: 'GET',
        header: {
          'Authorization': token
        },
        success: function (res) {
          if (res.data == "Unauthorized") {
            wx.removeStorage({
              key: 'Token',
            })
            wx.redirectTo({
              url: '../../pages/login/login',
            })
          }
          if (res.data.type == 'Success') {
            resolve(res.data);
          }
        }
      })
    }).catch(err=>{
      wx.redirectTo({
        url: '../../pages/login/login',
      })
    })
  },
  getDayUserNum: async function (token) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://${app.ip}:5001/admin/user/getDayUserNum`,
        method: 'GET',
        header: {
          'Authorization': token
        },
        success: function (res) {
          if (res.data == "Unauthorized") {
            wx.removeStorage({
              key: 'Token',
            })
            wx.redirectTo({
              url: '../../pages/auth/auth',
            })
          }
          if (res.data.type == 'Success') {
            resolve(res.data.num);
          }
        }
      })
    })
  },
  getDayLogNum: function (token) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://${app.ip}:5001/admin/user/getDayLogNum`,
        method: 'GET',
        header: {
          'Authorization': token
        },
        success: function (res) {
          if (res.data == "Unauthorized") {
            wx.removeStorage({
              key: 'Token',
            })
            wx.redirectTo({
              url: '../../pages/auth/auth',
            })
          }
          if (res.data.type == 'Success') {
            resolve(res.data.num);
          }
        }
      })
    })
  },
  getRegisterNum: function (token) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://${app.ip}:5001/admin/user/getregisterNum`,
        method: 'GET',
        header: {
          'Authorization': token
        },
        success: function (res) {
          if (res.data == "Unauthorized") {
            wx.removeStorage({
              key: 'Token',
            })
            wx.redirectTo({
              url: '../../pages/auth/auth',
            })
          }
          if (res.data.type == 'Success') {
            resolve(res.data.num);
          }
        }
      })
    })
  }
})