const { $Message } = require('../../dist/base/index');
const Oauth = require('../../utils/auth');
const getUser = require('../../utils/getUser');
const oauth = new Oauth();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let token = await getUser.getUserToken();
    if (token != 'error') {
      wx.switchTab({
        url: '../index/index',
      })
    }
  },
  getUserInfo: function (res) {
    console.log(res)
    if (res.detail.errMsg == 'getUserInfo:fail auth deny') {
      $Message({
        content: '用户取消',
        type: 'warning'
      });
      return;
    }
    wx.setStorage({
      key: "userInfo",
      data: JSON.stringify(res.detail.userInfo)
    })
    wx.login({
      success: res => {
        if (res.code) {
          let item = {}
          wx.getUserInfo({
            success: function (e) {
              item.iv = e.iv;
              item.encryptedData = e.encryptedData
            },
            complete() {
              item.code = res.code
              // 获取token
              wx.request({
                url: `http://${app.ip}:5000/auth/user/login`,
                data: item,
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success(data) {
                  if (data.data.msg == 'Success') {
                    $Message({
                      content: '授权成功',
                      type: 'success'
                    });
                    oauth.loginUser() // 获取token
                    wx.switchTab({
                      url: '../index/index',
                    })
                  } else {
                    $Message({
                      content: '授权失败，稍后重试',
                      type: 'error'
                    });
                  }
                }
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }
})