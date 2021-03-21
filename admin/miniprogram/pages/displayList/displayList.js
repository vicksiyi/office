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
    $Message({
      content: '单击可查看收到情况',
      type: 'warning'
    })
  },
  nav:function(){
    wx.navigateTo({
      url: '../../pages/displayStatic/displayStatic',
    })
  }
})