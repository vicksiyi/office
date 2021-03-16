const app = getApp()
const getUser = require('../../utils/getUser');
const formatTime = require('../../utils/formatTime');
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tag: ['RAP', '鬼畜调教', '鬼畜', '搞笑', 'RAP', '鬼畜调教', '鬼畜', '搞笑', 'RAP', '鬼畜调教', '鬼畜', '搞笑'],
    current: 'tab1',
    spinShow: false,
    video: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let _this = this;
    console.log(options._id)
    wx.setNavigationBarTitle({
      title: '视频名称',
    })
    let result = await this.getVideo(options._id);
    result.profile.time = formatTime.changeTime(result.profile.time);
    result.profile.videoTag = result.profile.videoTag == '' ? [] : result.profile.videoTag.split(';');
    this.setData({
      video: result.profile
    })
  },
  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
  },
  complaint: function () {
    wx.navigateTo({
      url: '../../pages/complaint/complaint?id=1',
    })
  },
  getVideo: async function (id) {
    let _this = this;
    this.setData({
      spinShow: true
    })
    let token = await getUser.getUserToken()
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://${app.ip}:5000/send/video/getOneVideo/${id}`,
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
          if (res.data.type == "Success") {
            resolve(res.data);
          }
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