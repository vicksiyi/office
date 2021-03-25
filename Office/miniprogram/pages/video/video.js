const app = getApp()
const getUser = require('../../utils/getUser');
const formatTime = require('../../utils/formatTime');
const { $Message } = require('../../dist/base/index');
var navSetTime = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tag: [],
    current: 'tab1',
    spinShow: false,
    video: {},
    isFocus: false,
    isCollection: false,
    isGood: false,
    userDetail: {},
    token: '',
    numCollection: 0,
    numShare: 0,
    numGood: 0,
    inputText: '',
    comment: [],
    status: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let _this = this;
    let result = await this.getVideo(options._id);
    this.testFocus(result.profile.userOpenId);
    wx.setNavigationBarTitle({
      title: result.profile.title,
    })
    result.profile.time = formatTime.changeTime(result.profile.time);
    result.profile.videoTag = result.profile.videoTag == '' ? [] : result.profile.videoTag.split(';');
    this.setData({
      video: result.profile
    })
  },
  async handleChange({ detail }) {
    let comment = await this.getComment(this.data.token, this.data.video._id, 0, detail.key == 'tab1' ? 0 : 1, 0);
    this.setData({
      current: detail.key,
      status: detail.key == 'tab1' ? 0 : 1,
      comment: comment
    });
  },
  complaint: function () {
    wx.navigateTo({
      url: `../../pages/complaint/complaint?id=${this.data.video._id}`,
    })
  },
  getVideo: async function (id) {
    let _this = this;
    this.setData({
      spinShow: true
    })
    let token = await getUser.getUserToken()
    this.setData({
      token: token
    })
    this.testColloction(token, id);
    this.testGood(token, id);
    this.getColloctionNum(id);
    this.getGoodNum(id);
    this.getShareNum(id);
    let comment = await this.getComment(token, id, 0, 0);
    this.setData({
      comment: comment
    })
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
  },
  navFocus: function () {
    wx.navigateTo({
      url: `../../pages/detail/detail?openId=${this.data.userDetail.openId}&nickName=${this.data.userDetail.nickName}`,
      fail: function (err) {
        $Message({
          content: '循环跳转太多次',
          type: 'warning'
        })
        navSetTime = setTimeout(() => {
          clearTimeout(navSetTime);
          wx.navigateBack({
            delta: 10,
          })
        }, 1000)
      }
    })
  },
  focus: async function () {
    let _this = this;
    let token = await getUser.getUserToken()
    wx.request({
      url: `http://${app.ip}:5000/user/focus/add`,
      method: 'POST',
      data: {
        openId: this.data.video.userOpenId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token
      },
      success: function (res) {
        if (res.data.type == 'Success') {
          $Message({
            content: '关注成功',
            type: 'success'
          })
        }
        _this.setData({
          isFocus: true
        })
        if (res.data.type == 'err') {
          $Message({
            content: '未知错误',
            type: 'error'
          })
        }
        if (res.data.type == 'added') {
          $Message({
            content: '不能重复关注',
            type: 'warning'
          })
        }
      }
    })
  },
  testFocus: async function (openId) {
    let _this = this;
    let token = await getUser.getUserToken()
    this.getUserDetail(token, openId)
    wx.request({
      url: `http://${app.ip}:5000/user/focus/test`,
      method: 'POST',
      data: {
        openId: openId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token
      },
      success: function (res) {
        _this.setData({
          isFocus: res.data.type
        })
      }
    })
  },
  getUserDetail: function (token, openId) {
    let _this = this;
    wx.request({
      url: `http://${app.ip}:5000/user/focus/userDetail`,
      method: 'POST',
      data: {
        openId: openId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token
      },
      success: function (res) {
        _this.setData({
          userDetail: res.data
        })
      }
    })
  },
  collection: function () {
    let _this = this;
    wx.request({
      url: `http://${app.ip}:5000/user/collection/add?_id=${this.data.video._id}`,
      method: 'GET',
      header: {
        'Authorization': this.data.token
      },
      success: function (res) {
        if (res.data.type == 'Success') {
          _this.setData({
            isCollection: true,
            numCollection: _this.data.numCollection + 1
          })
          $Message({
            content: '收藏成功',
            type: 'success'
          })
        }
      }
    })
  },
  testColloction: function (token, _id) {
    let _this = this;
    wx.request({
      url: `http://${app.ip}:5000/user/collection/test?_id=${_id}`,
      method: 'GET',
      header: {
        'Authorization': token
      },
      success: function (res) {
        _this.setData({
          isCollection: res.data.type,
        })
      }
    })
  },
  clearCollection: function () {
    let _this = this;
    wx.request({
      url: `http://${app.ip}:5000/user/collection/clear?_id=${this.data.video._id}`,
      method: 'GET',
      header: {
        'Authorization': this.data.token
      },
      success: function (res) {
        if (res.data.type == 'Success') {
          _this.setData({
            isCollection: false,
            numCollection: _this.data.numCollection - 1
          })
          $Message({
            content: '取消收藏成功',
            type: 'success'
          })
        }
      }
    })
  },
  share: function () {
    let _this = this;
    wx.request({
      url: `http://${app.ip}:5000/user/share/add?_id=${this.data.video._id}`,
      method: 'GET',
      header: {
        'Authorization': this.data.token
      },
      success: function (res) {
        if (res.data.type == 'Success') {
          _this.setData({
            numShare: _this.data.numShare + 1
          })
          $Message({
            content: '分享成功',
            type: 'success'
          })
        }
      }
    })
  },
  good: function () {
    let _this = this;
    wx.request({
      url: `http://${app.ip}:5000/user/good/add?_id=${this.data.video._id}`,
      method: 'GET',
      header: {
        'Authorization': this.data.token
      },
      success: function (res) {
        if (res.data.type == 'Success') {
          _this.setData({
            isGood: true,
            numGood: _this.data.numGood + 1
          })
          $Message({
            content: '点赞成功',
            type: 'success'
          })
        }
      }
    })
  },
  testGood: function (token, _id) {
    let _this = this;
    wx.request({
      url: `http://${app.ip}:5000/user/good/test?_id=${_id}`,
      method: 'GET',
      header: {
        'Authorization': token
      },
      success: function (res) {
        _this.setData({
          isGood: res.data.type
        })
      }
    })
  },
  clearGood: function () {
    let _this = this;
    wx.request({
      url: `http://${app.ip}:5000/user/good/clear?_id=${this.data.video._id}`,
      method: 'GET',
      header: {
        'Authorization': this.data.token
      },
      success: function (res) {
        if (res.data.type == 'Success') {
          _this.setData({
            isGood: false,
            numGood: _this.data.numGood - 1
          })
          $Message({
            content: '取消点赞成功',
            type: 'success'
          })
        }
      }
    })
  },
  getColloctionNum: function (_id) {
    let _this = this;
    wx.request({
      url: `http://${app.ip}:5000/user/collection/getNum?_id=${_id}`,
      method: 'GET',
      success: function (res) {
        _this.setData({
          numCollection: res.data.num
        })
      }
    })
  },
  getGoodNum: function (_id) {
    let _this = this;
    wx.request({
      url: `http://${app.ip}:5000/user/good/getNum?_id=${_id}`,
      method: 'GET',
      success: function (res) {
        _this.setData({
          numGood: res.data.num
        })
      }
    })
  },
  getShareNum: function (_id) {
    let _this = this;
    wx.request({
      url: `http://${app.ip}:5000/user/share/getNum?_id=${_id}`,
      method: 'GET',
      success: function (res) {
        _this.setData({
          numShare: res.data.num
        })
      }
    })
  },
  send: function () {
    let _this = this;
    if (!_this.data.inputText) {
      $Message({
        content: '不可为空',
        type: "warning"
      })
      return;
    }
    wx.getSystemInfo({
      success: (result) => { //_this.data.inputText,_this.data.video._id,result.system
        wx.request({
          url: `http://${app.ip}:5000/user/comment/add`,
          method: 'POST',
          data: {
            msg: _this.data.inputText,
            videoId: _this.data.video._id,
            system: result.system
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
                url: '../../pages/auth/auth',
              })
            }
            if (res.data.type == 'Success') {
              $Message({
                content: '成功评论',
                type: 'success'
              })
              _this.setData({
                inputText: ''
              })
              // _this.onLoad(_this.data.video._id);
            }
          }
        })
      }
    })
  },
  inputText: function (e) {
    this.setData({
      inputText: e.detail.value
    })
  },
  getComment: function (token, id, start, status = 0, type = 0) {
    let _this = this;
    console.log(id)
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://${app.ip}:5000/user/comment/getComment/${id}/${start}/${status}/${type}`,
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
              url: '../../pages/auth/auth',
            })
          }
          if (res.data.type == 'Success') {
            for (let i = 0; i < res.data.res.length; i++) {
              res.data.res[i].time = formatTime.changeTime(res.data.res[i].time);
            }
            resolve(res.data.res);
          }
        }
      })
    })
  }
})