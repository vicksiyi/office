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
    token: '',
    notice: [],
    start: 0,
    height: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let _this = this;
    $Message({
      content: '单击可查看收到情况',
      type: 'warning'
    })
    wx.getSystemInfo({
      success: (result) => {
        _this.setData({
          height: result.windowHeight
        })
      },
    })
    let result = await this.getNoticeList(0);
    this.setData({
      notice: result
    })
  },
  nav: function (e) {
    let id = e.currentTarget.dataset.id;
    let detail = e.currentTarget.dataset.detail;
    wx.navigateTo({
      url: `../../pages/displayStatic/displayStatic?id=${id}&detail=${JSON.stringify(detail)}`,
    })
  },
  del: function (e) {
    let _this = this;
    let id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    this.setData({
      spinShow: true
    })
    wx.request({
      url: `http://${app.ip}:5001/admin/notice/delNotice/${id}`,
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
          let notice = _this.data.notice;
          notice.splice(index, 1);
          _this.setData({
            spinShow: false,
            notice: notice
          })
          $Message({
            content: '删除成功',
            type: 'success'
          })
        }
      },
      fail: function (err) {
        reject(err);
      }
    })
  },
  getNoticeList: async function (start) {
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
        url: `http://${app.ip}:5001/admin/notice/getNotice/${start}`,
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
            for (let i = 0; i < res.data.notice.length; i++) {
              res.data.notice[i].time = formatTime.changeTime(res.data.notice[i].time);
            }
            resolve(res.data.notice);
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
    let data = [];
    data = await this.getNoticeList(start);
    let resource = this.data.notice;
    resource.push(...data)
    if (data.length == 0) {
      $Message({
        content: '底线到了...',
        type: 'warning'
      })
      return;
    }
    this.setData({
      notice: resource,
      start: start
    })
  }
})