// pages/information/information.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputNickName: '',
    visible1: false,
    visible4: false,
    actions4: [
      {
        name: '昵称'
      },
      {
        name: '手机号'
      },
      {
        name: '邮箱号'
      },
      {
        name: '取消',
        color: '#ff9900'
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  handleClick: function (e) {
    let _this = this;
    let id = e.detail.index;
    if (id == 0) {
      _this.setData({
        visible1: true
      })
    } else if (id == 1) {
      wx.navigateTo({
        url: '../../pages/phone/phone'
      })
    } else if (id == 2) {
      wx.navigateTo({
        url: '../../pages/email/email'
      })
    }
    _this.setData({
      visible4: false
    })
  },
  modify: function () {
    this.setData({
      visible4: true
    })
  },
  handleOk: function () {
    console.log('Ok', this.data.inputNickName)
    this.setData({
      visible1: false
    })
  },
  handleClose: function () {
    console.log('close')
    this.setData({
      visible1: false
    })
  },
  nickNameChange: function (e) {
    this.setData({
      inputNickName: e.detail.value
    })
  }
})