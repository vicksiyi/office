const app = getApp()
const getUser = require('../../utils/getUser');
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: [],
    token: '',
    start: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let result = await this.getFocus(this.data.start);
    this.setData({
      focus: result.res
    })
  },
  nav: function (e) {
    console.log('跳转')
    wx.navigateTo({
      url: `../../pages/detail/detail?openId=${e.currentTarget.dataset.openid}&nickName=${e.currentTarget.dataset.nickname}`,
    })
  },
  clearFocus: function (e) {
    let temp = `focus[${e.currentTarget.dataset.id}].isFocus`
    console.log(e.currentTarget.dataset)
    wx.request({
      url: `http://${app.ip}:5000/user/focus/clearFocus/${e.currentTarget.dataset.openid}`,
      method: 'GET',
      header: {
        'Authorization': this.data.token
      },
      success: function (res) {
        if (res.data.type == 'Success') {
          $Message({
            content: '取消成功',
            type: 'success'
          })
        }
      }
    })
    this.setData({
      [temp]: false
    })
  },
  getFocus: async function (start) {
    let token = await getUser.getUserToken()
    this.setData({
      token: token
    })
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://${app.ip}:5000/user/focus/getFocus/${start}`,
        method: 'GET',
        header: {
          'Authorization': token
        },
        success: function (res) {
          for (let i = 0; i < res.data.res.length; ++i) {
            res.data.res[i].isFocus = true;
          }
          resolve(res.data);
        }
      })
    })
  },
  focus: async function (e) {
    let _this = this;
    let temp = `focus[${e.currentTarget.dataset.id}].isFocus`
    let token = await getUser.getUserToken()
    wx.request({
      url: `http://${app.ip}:5000/user/focus/add`,
      method: 'POST',
      data: {
        openId: e.currentTarget.dataset.openid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token
      },
      success: function (res) {
        if (res.data.type == 'Success') {
          $Message({
            content: '关注成功',
            type: 'success'
          })
        }
        _this.setData({
          [temp]: true
        })
        if (res.data.type == 'err') {
          $Message({
            content: '未知错误',
            type: 'error'
          })
        }
        if (res.data.type == 'added') {
          $Message({
            content: '不能重复关注',
            type: 'warning'
          })
        }
      }
    })
  },
  tolower: async function (e) {
    let _this = this;
    let start = this.data.start + 1;
    let data = await this.getFocus(start);
    let resource = this.data.focus;
    resource.push(...data)
    if (data.length == 0) {
      $Message({
        content: '底线到了...',
        type: 'warning'
      })
      return;
    }
    this.setData({
      focus: resource,
      start: start
    })
  }
})