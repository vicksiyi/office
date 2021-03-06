// pages/video/video.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tag: ['RAP', '鬼畜调教', '鬼畜', '搞笑','RAP', '鬼畜调教', '鬼畜', '搞笑','RAP', '鬼畜调教', '鬼畜', '搞笑'],
    current: 'tab1',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '视频名称',
    })
  },
  handleChange ({ detail }) {
      this.setData({
          current: detail.key
      });
  }
})