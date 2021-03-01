const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getUserInfo: function (res) {
    console.log(res)
    if (res.detail.errMsg == 'getUserInfo:fail auth deny') {
      $Message({
        content: '用户取消',
        type: 'warning'
      });
      return;
    }
    $Message({
      content: '授权成功',
      type: 'warning'
    });
    wx.setStorage({
      key: "userInfo",
      data: JSON.stringify(res.detail.userInfo)
    })
    wx.switchTab({
      url: '../index/index',
    })
  }
})