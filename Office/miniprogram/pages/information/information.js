const app = getApp()
const getUser = require('../../utils/getUser');
const base64 = require('../../utils/base64');
const { $Message } = require('../../dist/base/index');
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
    user: {},
    avatarUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: async function (options) {
    let user = await this.getUser();
    this.setData({
      user: user
    })
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
    let temp = 'user.nickName'
    this.setData({
      [temp]: this.data.inputNickName
    })
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
  },
  getUser: async function () {
    let _this = this;
    this.setData({
      spinShow: true
    })
    let token = await getUser.getUserToken()
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://${app.ip}:5000/user/modify/getUser`,
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
              url: '../../pages/auth/auth',
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
        url: '../../pages/auth/auth',
      })
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
            let userInfo = await getUser.getUserInfo();
            userInfo = JSON.parse(userInfo);
            wx.cloud.uploadFile({
              cloudPath: `image/${Date.parse(new Date()) + base64.encode(userInfo.nickName)}.png`, // 上传至云端的路径
              filePath: res.path, // 小程序临时文件路径
              success: async res2 => {
                // 返回文件 ID
                let temp = 'user.avatarUrl'
                let url = await getUser.getTempUrl(res2.fileID);
                console.log(url)
                _this.setData({
                  [temp]: url[0].tempFileURL,
                  avatarUrl: res2.fileID
                })
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