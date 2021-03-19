const app = getApp()
const getUser = require('../../utils/getUser');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardList: [
      {
        'title': '个人信息',
        'logo': '../../images/me/person.png',
        'nav': '../information/information'
      },
      {
        'title': '上传视频',
        'logo': '../../images/me/upload.png',
        'nav': '../upload/upload'
      },
      {
        'title': '我的关注',
        'logo': '../../images/me/focus.png',
        'nav': '../focus/focus'
      },
      {
        'title': '我的收藏',
        'logo': '../../images/me/collection.png',
        'nav': '../collection/collection'
      },
      {
        'title': '我的视频',
        'logo': '../../images/me/video.png',
        'nav': '../myvideo/myvideo'
      },
      {
        'title': '错题集',
        'logo': '../../images/me/errorCollection.png',
        'nav': '../errorCollection/errorCollection'
      },
      {
        'title': '反馈/客服',
        'logo': '../../images/me/customerService.png',
        'nav': '../customerService/customerService'
      },
      {
        'title': '答题记录',
        'logo': '../../images/me/card.png',
        'nav': '../answerLog/answerLog'
      },
      {
        'title': '设置',
        'logo': '../../images/me/setting.png',
        'nav': '../setting/setting'
      }
    ],
    cardHeight: 0,
    user: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let query = wx.createSelectorQuery();
    wx.getSystemInfo({
      success: (result) => {
        query.select(
          '.card').boundingClientRect(
            function (rect) {
              _this.setData({
                cardHeight: result.windowHeight - rect.height
              })
            }
          ).exec();
      }
    })
  },
  onShow: async function () {
    let user = await this.getUser();
    this.setData({
      user: user
    })
  },
  nav: function (res) {
    // console.log(this.data.cardList[res.currentTarget.dataset.id].nav)
    wx.navigateTo({
      url: `${this.data.cardList[res.currentTarget.dataset.id].nav}`
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
  }
})