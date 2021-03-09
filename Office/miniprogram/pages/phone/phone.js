// pages/email/email.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    time: 60
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  send: function () {
    let _this = this;
    this.setData({
      disabled: true
    })
    let setTime = setInterval(() => {
      if (this.data.time == 0) {
        clearInterval(setTime);
        _this.setData({
          time: 60,
          disabled: false
        })
        return;
      }
      _this.setData({
        time: this.data.time - 1
      })
    }, 1000);
  },
  submit: function () {
    console.log('提交')
  }
})