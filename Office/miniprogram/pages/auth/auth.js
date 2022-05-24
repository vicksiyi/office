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
    systemInfo: {}
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
    let systemInfo = await getUser.getSystemInfo()
    this.setData({
      systemInfo: systemInfo
    })
  },
  getUserInfo: function (res) {
    console.log(res)
    let _this = this;
    wx.getUserProfile({
      desc: '用途', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        // console.log("获取用户信息成功", res)
        // let user = res.userInfo
        // this.setData({
        //   isShowUserName: true,
        //   userInfo: user,
        // })
        wx.setStorage({
          key: "userInfo",
          data: JSON.stringify(res.userInfo)
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
                async complete() {
                  item.code = res.code
                  // 获取token
                  wx.request({
                    url: `http://${app.ip}:5000/auth/user/login`,
                    method: 'POST',
                    data: {
                      model: _this.data.systemInfo.model,
                      system: _this.data.systemInfo.system,
                      ...item
                    },
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
                      } else if (data.data.type == 'close') {
                        $Message({
                          content: `此号已被封,${data.data.time}自动解封`,
                          type: 'error'
                        });
                      } else {
                        $Message({
                          content: '授权失败，稍后重试',
                          type: 'error'
                        });
                      }
                    },
                    fail: function (err) {
                      console.log(err)
                    }
                  })
                }
              })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
        // user.openid = app.globalData.openid;
        // app._saveUserInfo(user);
      },
      fail: res => {
        $Message({
          content: '获取失败',
          type: 'warning'
        });
        // console.log("获取用户信息失败", res)
      }
    })
    if (res.detail.errMsg == 'getUserInfo:fail auth deny') {
      $Message({
        content: '用户取消',
        type: 'warning'
      });
      return;
    }
    // wx.setStorage({
    //   key: "userInfo",
    //   data: JSON.stringify(res.detail.userInfo)
    // })
  }
})