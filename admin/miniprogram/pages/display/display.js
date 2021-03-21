const app = getApp();
const { $Message } = require('../../dist/base/index');
const getUser = require('../../utils/getUser');
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
    spinShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    $Message({
      content: '可以上滑操作其他功能',
      type: 'warning'
    });
    wx.getSystemInfo({
      success: (result) => {
        _this.setData({
          height: result.windowHeight
        })
        pieChart = new wxCharts({
          animation: true,
          canvasId: 'pieCanvas',
          type: 'pie',
          series: [{
            name: '已收到',
            data: 0.6,
          }, {
            name: '未收到',
            data: 0.4
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
        time = setTimeout(()=>{
          clearTimeout(time);
          _this.setData({
            spinShow: false
          })
          wx.navigateBack({
            delta: 1,
          })
        },1000)
      },
      fail: function (err) {
        reject(err);
      }
    })
  },
  onUnload:function(){
    clearTimeout(time);
  }
})