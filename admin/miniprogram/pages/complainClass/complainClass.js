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
    spinShow: false,
    token: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getComplaintClass();
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
          console.log(_this.data.inputValue)
          complaintClass.push(res.data.msg);
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
    $Message({
      content: '用户取消',
      type: 'warning'
    })
    this.setData({
      visible: false
    })
  },
  inputChange: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  getComplaintClass: async function () {
    let _this = this;
    this.setData({
      spinShow: true
    })
    let token = await getUser.getUserToken();
    _this.setData({
      token: token
    })
    wx.request({
      url: `http://${app.ip}:5001/admin/complaint/getClass`,
      method: 'GET',
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
        if (res.data.type == 'Success') {
          _this.setData({
            complaintClass: res.data.complaintClass
          })
        }
        _this.setData({
          spinShow: false
        })
      },
      fail: function (err) {
        reject(err);
      }
    })
  },
  delComplaint: function (e) {
    let _this = this;
    _this.setData({
      spinShow: true
    })
    wx.request({
      url: `http://${app.ip}:5001/admin/complaint/delClass`,
      method: 'POST',
      data: {
        id: e.currentTarget.dataset.id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': _this.data.token
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
        if (res.data.type == 'Success') {
          $Message({
            content: '删除成功',
            type: 'success'
          })
          let complaintClass = _this.data.complaintClass;
          complaintClass.splice(e.currentTarget.dataset.index, 1);
          _this.setData({
            complaintClass: complaintClass
          })
        }
        _this.setData({
          spinShow: false
        })
      },
      fail: function (err) {
        reject(err);
      }
    })
  }
})