//index.js
const app = getApp()
const getUser = require('../../utils/getUser');
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    video: [],
    start: 0,
    spinShow: false,
    inputValue: '',
    token: '',
    timeStamp: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let _this = this
    this.setData({
      load: true
    })
    $Message({
      content: '双击视频可以删除',
      duration: 5,
      type: 'warning'
    });
    wx.getSystemInfo({
      success: (result) => {
        _this.setData({
          height: result.windowHeight - 50
        })
      },
    })
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
    let data = await this.getVideo(0);
    _this.setData({
      video: data,
      start: 0
    })
  },
  getVideo: async function (start) {
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
        url: `http://${app.ip}:5001/admin/video/getVideo/${start}`,
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
          for (let i = 0; i < res.data.length; ++i) { // cloud转temp
            res.data[i].imageUrl = await getUser.getTempUrl(res.data[i].imageUrl);
            res.data[i].imageUrl = res.data[i].imageUrl[0].tempFileURL
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
  tolower: async function (e) {
    let _this = this;
    let start = this.data.start + 1;
    let data = [];
    if (this.data.inputValue) {
      data = await this.search(start, this.data.inputValue);
    } else {
      data = await this.getVideo(start);
    }
    let resource = this.data.video;
    resource.push(...data)
    if (data.length == 0) {
      $Message({
        content: '底线到了...',
        type: 'warning'
      })
      return;
    }
    this.setData({
      video: resource,
      start: start
    })
  },
  inputChange: function (e) {
    this.setData({
      inputValue: e.detail.detail.value
    })
  },
  searchTitle: async function () {
    let result = await this.search(0, this.data.inputValue);
    this.setData({
      video: result,
      start: 0
    })
  },
  search: function (start, inputValue) {
    let _this = this;
    this.setData({
      spinShow: true
    })
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://${app.ip}:5001/admin/video/searchVideo/${start}?title=${inputValue}`,
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': this.data.token
        },
        success: async function (res) {
          for (let i = 0; i < res.data.length; ++i) { // cloud转temp
            res.data[i].imageUrl = await getUser.getTempUrl(res.data[i].imageUrl);
            res.data[i].imageUrl = res.data[i].imageUrl[0].tempFileURL
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
    })
  },
  delete: function (e) {
    let _this = this;
    if (this.data.timeStamp == 0) {
      _this.setData({
        timeStamp: e.timeStamp
      })
      return;
    }
    if (e.timeStamp - this.data.timeStamp < 300) {
      wx.request({
        url: `http://${app.ip}:5001/admin/video/delVideo/${e.currentTarget.dataset.id}`,
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': this.data.token
        },
        success: function (res) {
          if (res.data == "Unauthorized") {
            wx.removeStorage({
              key: 'Token',
            })
            wx.redirectTo({
              url: '../../pages/login/login',
            })
            return;
          }
          let video = _this.data.video;
          if (res.data.type == 'Success') {
            for (let i = 0; i < video.length; ++i) {
              if (video[i]._id == e.currentTarget.dataset.id) {
                video.splice(i, 1);
                break;
              }
            }
            _this.setData({
              video: video
            })
            $Message({
              content: '删除成功！',
              type: 'success'
            });
          } else {
            $Message({
              content: '未知错误',
              type: 'error'
            });
          }
        }
      })
      _this.setData({
        timeStamp: 0
      })
    }
  }
})