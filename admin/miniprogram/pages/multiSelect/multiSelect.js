const app = getApp()
const getUser = require('../../utils/getUser');
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeStamp: 0,
    isTips: false,
    spinShow: false,
    recordClass: [],
    select: ['A', 'B', 'C', 'D'],
    height: 0,
    start: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let _this = this;
    wx.getSystemInfo({
      success: (result) => {
        _this.setData({
          height: result.windowHeight
        })
      },
    })
    let result = await this.getRecordClass(0);

    this.setData({
      recordClass: result
    })
  },
  doubleClick: function (e) {
    let _this = this;
    if (this.data.timeStamp == 0) {
      _this.setData({
        timeStamp: e.timeStamp
      })
      return;
    }
    if (e.timeStamp - this.data.timeStamp < 300) {
      $Message({
        content: '双击',
        type: 'success'
      });
    }
    _this.setData({
      timeStamp: 0
    })
  },
  getRecordClass: async function (start) {
    let _this = this;
    this.setData({
      spinShow: true
    })
    const db = wx.cloud.database();
    return new Promise((resolve, reject) => {
      db.collection('multiSelect').skip(start * 20).orderBy('title', 'desc').get({
        success: function (res) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].result = _this.data.select[res.data[i].result];
          }
          resolve(res.data)
          _this.setData({
            spinShow: false
          })
        }
      })
    })
  },
  tolower: async function () {
    let _this = this;
    let start = this.data.start + 1;
    let data = await this.getRecordClass(start);
    let resource = this.data.recordClass;
    resource.push(...data)
    if (data.length == 0) {
      $Message({
        content: '底线到了...',
        type: 'warning'
      })
      return;
    }
    this.setData({
      recordClass: resource,
      start: start
    })
  },
  nav:function(){
    wx.navigateTo({
      url: '../../pages/addmultiSelect/addmultiSelect',
    })
  }
})