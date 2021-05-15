// pages/videoList/videoList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: ['Word', 'Excel', 'PPT']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  nav: function (e) {
    let item = e.currentTarget.dataset.item;
    let type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `../addVideo/addVideo?title=${item}&type=${type}`,
    })
  }
})