const app = getApp()
const getUser = require('../../utils/getUser');
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible: false,
    inputValue: '',
    complaintClass: [],
    spinShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  showModel: function () {
    this.setData({
      visible: true
    })
  },
  handleConfirm: async function () {
    let _this = this;
    if (!_this.data.inputValue) {
      $Message({
        content: '类别不能为空',
        type: 'error'
      })
      return;
    }
    _this.setData({
      spinShow: true
    })
    let token = await getUser.getUserToken();
    console.log()
    wx.request({
      url: `http://${app.ip}:5001/admin/complaint/addClass`,
      method: 'POST',
      data: {
        title: _this.data.inputValue
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token
      },
      success: function (res) {
        if (res.data == "Unauthorized") {
          wx.removeStorage({
            key: 'Token',
          })
          wx.redirectTo({
            url: '../../pages/login/login',
          })
        }
        if (res.data.type == 'added') {
          $Message({
            content: '不能重复添加类别',
            type: 'warning'
          })
        }
        if (res.data.type == 'Success') {
          $Message({
            content: '添加成功',
            type: 'success'
          })
          let complaintClass = _this.data.complaintClass;
          complaintClass.push(_this.data.inputValue);
          _this.setData({
            complaintClass: complaintClass
          })
        }
        if (res.data.type == 'err') {
          $Message({
            content: '未知错误',
            type: 'error'
          })
        }
        _this.setData({
          spinShow: false,
          visible: false,
          inputValue: ''
        })
      },
      fail: function (err) {
        reject(err);
      }
    })
  },
  handleClose: function () {

  },
  inputChange: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  }
})