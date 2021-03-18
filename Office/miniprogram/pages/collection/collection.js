const { $Message } = require('../../dist/base/index');
const app = getApp()
const getUser = require('../../utils/getUser');
var navSetTime = null
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
    start: 0,
    height: 0,
    token: '',
    id: '',
    index: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let _this = this;
    let result = await this.getCollection(0);
    this.setData({
      video: result
    })
    wx.getSystemInfo({
      success: (result) => {
        _this.setData({
          height: result.windowHeight
        })
      },
    })
  },
  handleClick5({ detail }) {
    if (detail.index === 0) {
      this.setData({
        visible5: false
      });
    } else {
      const action = [...this.data.actions5];
      action[1].loading = true;

      this.setData({
        actions5: action
      });
      this.clearCollection(this.data.id, this.data.index);
    }
  },
  delete: function (e) {
    this.setData({
      visible5: true,
      id: e.currentTarget.dataset.id,
      index: e.currentTarget.dataset.index
    })
  },
  getCollection: async function (start) {
    let _this = this;
    let token = await getUser.getUserToken()
    _this.setData({
      token: token
    })
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://${app.ip}:5000/user/collection/getUserCollection/${start}`,
        method: 'GET',
        header: {
          'Authorization': token
        },
        success: function (res) {
          if (res.data.type == 'Success') {
            resolve(res.data.res);
          }
        }
      })
    })
  },
  tolower: async function (e) {
    let start = this.data.start + 1;
    let data = await this.getCollection(start);
    console.log(data)
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
  nav: function (e) {
    wx.navigateTo({
      url: `../../pages/video/video?_id=${e.currentTarget.dataset.id}`,
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
  clearCollection: function (id, index) {
    let _this = this;
    wx.request({
      url: `http://${app.ip}:5000/user/collection/clear?_id=${id}`,
      method: 'GET',
      header: {
        'Authorization': this.data.token
      },
      success: function (res) {
        if (res.data.type == 'Success') {
          $Message({
            content: '取消收藏成功',
            type: 'success'
          })
          let data = _this.data.video;
          const action = [..._this.data.actions5];
          data.splice(index, 1);
          action[1].loading = false;
          _this.setData({
            video: data,
            visible5: false,
            actions5: action
          })
        }
      }
    })
  },
  onUnload: function () {
    clearTimeout(navSetTime);
  }
})