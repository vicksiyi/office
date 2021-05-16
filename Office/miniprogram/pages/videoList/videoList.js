const { $Message } = require('../../dist/base/index');
var time = null;
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowVideo: false,
    seriseVideo: [],
    types: ['Word', 'Excel', 'PPT'],
    type: '',
    video: '',
    title: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let type = options.type;
    let token = await wx.getStorageSync('Token');
    let seriseVideo = await this.getSeriesVideo(token, type, 0);
    this.setData({
      token: token,
      seriseVideo: seriseVideo,
      type: type
    })
    wx.setNavigationBarTitle({
      title: this.data.types[options.type]
    })
  },
  showVideo: function (e) {
    let index = e.currentTarget.dataset.index;
    let _this = this;
    if (index != undefined) {
      _this.setData({
        video: this.data.seriseVideo[index].videoUrl,
        title: this.data.seriseVideo[index].title
      })
    }
    this.setData({
      isShowVideo: !this.data.isShowVideo,
    })
  },
  getSeriesVideo: function (token, type, start) {
    let _this = this;
    wx.showLoading({
      title: '加载数据',
      mask: true
    })
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://${app.ip}:5000/send/video/getSeriesVideo/${type}/${start}`,
        header: {
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
          if (res.data.type != 'err') {
            resolve(res.data)
          }
        },
        fail: function (err) {
          reject(err);
        },
        complete: () => {
          wx.hideLoading()
        }
      })
    })
  }
})