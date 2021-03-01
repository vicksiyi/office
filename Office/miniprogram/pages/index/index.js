//index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'tab1',
    load: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
  }
})