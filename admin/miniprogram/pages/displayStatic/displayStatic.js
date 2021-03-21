const app = getApp()
const getUser = require('../../utils/getUser');
const formatTime = require('../../utils/formatTime');
const { $Message } = require('../../dist/base/index');
const wxCharts = require("../../utils/wxcharts.js");
var pieChart = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    spinShow: false,
    token: '',
    notice: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let id = options.id;
    let notice = JSON.parse(options.detail);
    let result = await this.getNoticeStatic(id);
    this.setData({
      notice: notice
    })
    let num = result.num / result.allNum
    wx.getSystemInfo({
      success: (result) => {
        pieChart = new wxCharts({
          animation: true,
          canvasId: 'pieCanvas',
          type: 'pie',
          series: [{
            name: '已收到',
            data: num,
          }, {
            name: '未收到',
            data: 1 - num
          }],
          width: result.windowWidth,
          height: 200,
          dataLabel: true,
        });
      },
    })
  },
  getNoticeStatic: async function (id) {
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
        url: `http://${app.ip}:5001/admin/notice/getNoticeStatic`,
        method: 'POST',
        data: {
          msgId: id
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
              url: '../../pages/login/login',
            })
          }
          if (res.data.type == 'Success') {
            _this.setData({
              spinShow: false
            })
            resolve(res.data);
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
  }
})