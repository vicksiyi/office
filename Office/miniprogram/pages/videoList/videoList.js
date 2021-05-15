// pages/videoList/videoList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowVideo: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.type
    })
  },
  showVideo: function () {
    this.setData({
      isShowVideo: !this.data.isShowVideo
    })
  }
})