const app = getApp()
const getUser = require('../../utils/getUser');
const { $Message } = require('../../dist/base/index');
var WxParse = require('../../wxParse/wxParse.js');
var time = null;
Page({
  data: {
    title: '',
    from: '',
    time: '',
    spinShow: false
  },
  onLoad: function (option) {
    let _this = this;
    wx.getStorage({
      key: 'tempDetail',
      success: function (res) {
        let detail = JSON.parse(res.data);
        _this.setData({
          title: detail.title,
          from: detail.from
        })
        _this.getDetail(detail.newsUrl);
      }
    });
  },
  getDetail: async function (url) {
    let _this = this;
    let token = await getUser.getUserToken();
    _this.setData({
      spinShow: true
    })
    wx.request({
      url: `http://${app.ip}:5000/news/service/getNewsDetail`,
      method: 'POST',
      data: {
        url: url
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
            time: res.data.time
          })
          WxParse.wxParse('article', 'html', res.data.content, _this, 5);
        }
        if (res.data.type == 'err') {
          $Message({
            content: '本新闻格式错误',
            type: 'error'
          })
          time = setTimeout(()=>{
            clearTimeout(time);
            wx.navigateBack({
              delta: 1,
            })
          },1000)
        }
        _this.setData({
          spinShow: false
        })
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
