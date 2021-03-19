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
    const db = wx.cloud.database();
    db.collection('close').where({
      type: 'errorCollection'
    }).get({
      success: function (res) {
        console.log(res.data)
        if (res.data.length == 0) {
          _this.setData({
            isTips: true
          })
        }
      }
    })
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
      console.log('双击')
      $Message({
        content: '双击',
        type: 'success'
      });
    }
    _this.setData({
      timeStamp: 0
    })
  },
  closeBar: async function () {
    const db = wx.cloud.database()
    db.collection('close').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        type: 'errorCollection'
      },
      success: function (res) {
        $Message({
          content: '已经设置以后不再提示',
          type: 'warning'
        });
      }
    })
  },
  getRecordClass: async function (start) {
    let _this = this;
    this.setData({
      spinShow: true
    })
    let token = await getUser.getUserToken();
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://${app.ip}:5000/exam/exam/getRecordClass/${start}`,
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
          for (let i = 0; i < res.data.length; i++) {
            let temp = await _this.getIdToTitle(res.data[i].titleId, res.data[i].type);
            Object.assign(res.data[i], res.data[i], temp)
            if (res.data[i].type == 1) {
              res.data[i].result = _this.data.select[res.data[i].result];
            } else {
              res.data[i].result = res.data[i].result == 0 ? '错误' : '正确';
            }
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
  getIdToTitle: function (id, type) {
    const db = wx.cloud.database();
    let temp = type == 0 ? 'radio' : 'multiSelect';
    return new Promise((resolve, reject) => {
      db.collection(temp).doc(id).get({
        success: function (res) {
          resolve(res.data);
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
  }
})