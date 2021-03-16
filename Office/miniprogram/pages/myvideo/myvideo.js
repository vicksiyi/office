const app = getApp()
const getUser = require('../../utils/getUser');
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visible5: false,
    actions5: [
      {
        name: '取消'
      },
      {
        name: '删除',
        color: '#ed3f14',
        loading: false
      }
    ],
    video: [],
    spinShow: false,
    start: 0,
    temp_id: '',
    height: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let _this = this;
    let data = await this.getVideo(this.data.start);
    this.setData({
      video: data
    })
    wx.getSystemInfo({
      success: (result) => {
        _this.setData({
          height: result.windowHeight
        })
      }
    })
  },
  async handleClick5({ detail }) {
    let _this = this;
    if (detail.index === 0) {
      _this.setData({
        visible5: false,
        tempOpenId: ''
      });
    } else {
      const action = [..._this.data.actions5];
      action[1].loading = true;
      _this.setData({
        actions5: action
      });
      let token = await getUser.getUserToken();
      wx.request({
        url: `http://${app.ip}:5000/send/video/delVideo/${_this.data.temp_id}`,
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
            return;
          }
          if (res.data.type == 'Success') {
            action[1].loading = false;
            let video = _this.data.video;
            for (let i = 0; i < video.length; ++i) {
              console.log(video[i]._id)
              if (video[i]._id == _this.data.temp_id) {
                video.splice(i, 1);
                break;
              }
            }
            _this.setData({
              visible5: false,
              actions5: action,
              video: video
            });
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
    }
  },
  delete: function (e) {
    this.setData({
      visible5: true,
      temp_id: e.currentTarget.dataset.id
    })
  },
  getVideo: async function (start) {
    let _this = this;
    this.setData({
      spinShow: true
    })
    let token = await getUser.getUserToken();
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://${app.ip}:5000/send/video/myVideo/${start}`,
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
            return;
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
        url: '../../pages/auth/auth',
      })
    })
  },
  tolower: async function () {
    let start = this.data.start + 1;
    let data = await this.getVideo(start);
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
  }
})