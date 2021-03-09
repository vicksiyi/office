// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switch1: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  }, 
  onChange(event) {
    const detail = event.detail;
    this.setData({
      'switch1': detail.value
    })

  }
})