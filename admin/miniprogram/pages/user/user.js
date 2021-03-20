const app = getApp();
const { $Message } = require('../../dist/base/index');
const getUser = require('../../utils/getUser');
const getRandom = require('../../utils/getRandom');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    spinShow: false,
    token: '',
    user: [],
    showRight: false,
    height: 0,
    userDetail: {},
    inputValue: '',
    modifyType: '',
    visible1: false,
    modifyTypeName: {
      nickName: '昵称',
      email: '邮箱号',
      phone: '手机号',
      msg: '个人简介'
    },
    modifyIndex: 0,
    closeTime: '',
    isClose: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let _this = this;
    let getUser = await this.getUser(0);
    this.setData({
      user: getUser.user
    })
    wx.getSystemInfo({
      success: (result) => {
        _this.setData({
          height: result.windowHeight - 100
        })
      },
    })
  },
  getUser: async function (start) {
    let _this = this;
    this.setData({
      spinShow: true
    })
    let token = await getUser.getUserToken()
    this.setData({
      token: token
    })
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://${app.ip}:5001/admin/user/getUser/${start}`,
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': token
        },
        success: async function (res) {

          if (res.data == "Unauthorized") {
            wx.removeStorage({
              key: 'Token',
            })
            wx.redirectTo({
              url: '../../pages/login/login',
            })
          }
          _this.setData({
            spinShow: false
          })
          resolve(res.data);
        },
        fail: function (err) {
          reject(err);
        }
      })
    }).catch((err) => {
      wx.switchTab({
        url: '../../pages/login/login',
      })
    })
  },
  toggleRight: async function (e) {
    let _this = this;
    let user = this.data.user[e.currentTarget.dataset.index];
    if (!this.data.showRight) {
      $Message({
        content: '点击相应信息处可修改',
        type: 'warning'
      })
      let testClose = await this.testClose(user.openId);
      _this.setData({
        isClose: testClose.close,
        closeTime: testClose.time
      })
    }
    this.setData({
      showRight: !this.data.showRight,
      userDetail: user,
      modifyIndex: e.currentTarget.dataset.index
    })
  },
  modify: function (e) {
    this.setData({
      modifyType: e.currentTarget.dataset.type,
      visible1: true
    })
  },
  handleClose: function () {
    this.setData({
      visible1: false,
      inputValue: ''
    })
  },
  inputChange: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  handleOk: async function () {
    let _this = this;
    let result = await this.manageModify(_this.data.modifyType, _this.data.inputValue);
    if (result.type == 'Success') {
      $Message({
        content: '修改成功',
        type: 'success'
      })
      let temp = `user[${_this.data.modifyIndex}]`
      let userTemp = this.data.user[_this.data.modifyIndex];
      let userTempDetail = this.data.userDetail;

      if (_this.data.modifyType == 'nickName') {
        userTemp.nickName = _this.data.inputValue;
        userTempDetail.nickName = _this.data.inputValue;
      } else if (_this.data.modifyType == 'email') {
        userTemp.email = _this.data.inputValue;
        userTempDetail.email = _this.data.inputValue;
      } else if (_this.data.modifyType == 'phone') {
        userTemp.phone = _this.data.inputValue;
        userTempDetail.phone = _this.data.inputValue;
      } else {
        userTemp.msg = _this.data.inputValue;
        userTempDetail.msg = _this.data.inputValue;
      }
      _this.setData({
        visible1: false,
        inputValue: '',
        [temp]: userTemp,
        userDetail: userTempDetail
      })
    } else {
      $Message({
        content: '未知错误',
        type: 'error'
      })
    }

  },
  manageModify: function (type, value) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://${app.ip}:5001/admin/user/modifyUser`,
        method: 'POST',
        data: {
          [type]: value,
          _id: this.data.userDetail._id
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': this.data.token
        },
        success: async function (res) {
          if (res.data == "Unauthorized") {
            wx.removeStorage({
              key: 'Token',
            })
            wx.redirectTo({
              url: '../../pages/login/login',
            })
          }
          resolve(res.data);
        },
        fail: function (err) {
          reject(err);
        }
      })
    })
  },
  close: function () {
    $Message({
      content: '请选择封号到什么时候',
      type: 'warning'
    })
  },
  bindMultiPickerChange: function (e) {
    let _this = this;
    let time = Date.parse(new Date());
    let selectTime = Date.parse(e.detail.value);
    if (time > selectTime) {
      $Message({
        content: '过期时间不能小于当前时间',
        type: 'error'
      })
      return;
    }
    let second = selectTime - time;
    let hour = parseInt(second / (1000 * 60 * 60)) + 1;
    wx.request({
      url: `http://${app.ip}:5001/admin/user/closeUser`,
      method: 'POST',
      data: {
        time: e.detail.value,
        hour: hour,
        openId: this.data.userDetail.openId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': this.data.token
      },
      success: async function (res) {
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
            content: `成功封号${hour}小时`,
            type: 'success'
          })
          _this.setData({
            closeTime: e.detail.value,
            isClose: true
          })
        }
      },
      fail: function (err) {
        reject(err);
      }
    })
  },
  testClose: function (openId) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://${app.ip}:5001/admin/user/testClose`,
        method: 'POST',
        data: {
          openId: openId
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': this.data.token
        },
        success: async function (res) {
          if (res.data == "Unauthorized") {
            wx.removeStorage({
              key: 'Token',
            })
            wx.redirectTo({
              url: '../../pages/login/login',
            })
          }
          resolve(res.data);
        },
        fail: function (err) {
          reject(err);
        }
      })
    })
  },
  delClose: function () {
    let _this = this;
    wx.request({
      url: `http://${app.ip}:5001/admin/user/delClose`,
      method: 'POST',
      data: {
        openId: this.data.userDetail.openId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': this.data.token
      },
      success: async function (res) {
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
            content: '解封成功',
            type: 'success'
          })
          _this.setData({
            isClose: false
          })
        }
      },
      fail: function (err) {
        reject(err);
      }
    })
  },
  changeImage: function () {
    let _this = this;
    wx.showLoading({
      title: '上传中...',
      mask: true
    })
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          async success(res) {
            wx.cloud.uploadFile({
              cloudPath: `image/${Date.parse(new Date()) + getRandom.generateMixed(8)}.png`, // 上传至云端的路径
              filePath: res.path, // 小程序临时文件路径
              success: async res2 => {
                // 返回文件 ID
                let temp = `user[${_this.data.modifyIndex}].avatarUrl`
                let userTemp = `userDetail.avatarUrl`;
                let result = await _this.manageModify('avatarUrl', res2.fileID);
                if (result.type == 'Success') {
                  _this.setData({
                    [temp]: res2.fileID,
                    [userTemp]: res2.fileID
                  })
                  $Message({
                    content: '修改头像成功',
                    type: 'success'
                  })
                } else {
                  $Message({
                    content: '未知错误',
                    type: 'error'
                  })
                }
                wx.hideLoading()
              },
              fail: console.error
            })
          }
        })
      },
      fail: function (err) {
        console.log(err)
        $Message({
          content: '用户取消',
          type: 'warning'
        })
        wx.hideLoading()
      }
    })
  }
})