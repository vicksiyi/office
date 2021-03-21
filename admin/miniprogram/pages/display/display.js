const app = getApp();
const { $Message } = require('../../dist/base/index');
const getUser = require('../../utils/getUser');
const formatTime = require('../../utils/formatTime');
const wxCharts = require("../../utils/wxcharts.js");
var pieChart = null;
var time = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maxNumber: 400,//可输入最大字数
    number: 0,//已输入字数
    height: 0,
    inputValue: '',
    spinShow: false,
    notice: {},
    noticeStaticNum: 0,
    allNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let _this = this;
    $Message({
      content: '可以上滑操作其他功能',
      type: 'warning'
    });
    let token = await getUser.getUserToken();
    let lastNotice = await this.getLastNotice(token);
    lastNotice.time = formatTime.changeTime(lastNotice.time);
    let noticeStaticNum = await this.getLastNoticeStatic(token);
    _this.setData({
      notice: lastNotice,
      noticeStaticNum: noticeStaticNum.num,
      allNum: noticeStaticNum.allNum
    })
    wx.getSystemInfo({
      success: (result) => {
        _this.setData({
          height: result.windowHeight
        })
        let num = noticeStaticNum.num / noticeStaticNum.allNum
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
  change: function (e) {
    if (e.detail.current == 1) {
      $Message({
        content: '点击公告，可以查看更多详情',
        type: 'warning'
      })
    }
  },
  nav: function () {
    wx.navigateTo({
      url: '../../pages/displayList/displayList',
    })
  },
  inputText: function (e) {
    let _this = this;
    let value = e.detail.value;
    let len = value.length;
    if (len > this.data.maxNumber) {
      _this.setData({
        'number': this.data.maxNumber
      })
      return;
    }
    this.setData({
      'number': len,
      inputValue: value
    })
  },
  submit: async function () {
    let _this = this;
    let token = await getUser.getUserToken();
    this.setData({
      spinShow: true
    })
    wx.request({
      url: `http://${app.ip}:5001/admin/notice/add`,
      method: 'POST',
      data: {
        msg: _this.data.inputValue
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
          $Message({
            content: '发布成功',
            type: 'success'
          })
        }
        if (res.data.type == 'err') {
          $Message({
            content: '未知错误',
            type: 'error'
          })
        }
        time = setTimeout(() => {
          clearTimeout(time);
          _this.setData({
            spinShow: false
          })
          wx.navigateBack({
            delta: 1,
          })
        }, 1000)
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
        url: `http://${app.ip}:5001/admin/notice/getLastNotice`,
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': token
        },
        success: async function (res) {
          if (res.data.type == 'Success') {
            resolve(res.data.data);
          }
        },
        fail: function (err) {
          reject(err);
        }
      })
    })
  },
  getLastNoticeStatic: function (token) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://${app.ip}:5001/admin/notice/getLastNoticeStatic`,
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': token
        },
        success: async function (res) {
          if (res.data.type == 'Success') {
            resolve(res.data);
          }
        },
        fail: function (err) {
          reject(err);
        }
      })
    })
  },
  onUnload: function () {
    clearTimeout(time);
  }
})