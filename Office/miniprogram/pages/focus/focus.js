// pages/focus/focus.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  nav: function (e) {
    console.log('跳转')
    wx.navigateTo({
      url: '../../pages/detail/detail',
    })
  },
  clearFocus: function (e) {
    console.log(e.currentTarget.dataset.id)
    let focus = this.data.focus;
    focus.splice(e.currentTarget.dataset.id, 1)
    this.setData({
      focus: focus
    })
  }
})