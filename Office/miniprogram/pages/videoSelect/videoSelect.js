// pages/videoSelect/videoSelect.js
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
    wx.getVideoInfo({
      src: 'https://vd2.bdstatic.com/mda-md1602bkr6izq6xc/fhd/cae_h264_nowatermark/1617337142/mda-md1602bkr6izq6xc.mp4?v_from_s=gz_haokan_4469&auth_key=1617368280-0-0-30c1f12a90f4ad0c0c2ea77ab96d913a&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest=',
      success: function (res) {
        console.log(res)
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})