// pages/focus/focus.js
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
  nav:function(e){
    console.log('跳转')
    wx.navigateTo({
      url: '../../pages/detail/detail',
    })
  },
  clearFocus:function(e){
    console.log('取消关注')
  }
})