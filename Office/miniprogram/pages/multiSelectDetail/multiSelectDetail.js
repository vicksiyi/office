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
    detail: {},
    titleResult: [],
    spinShow: false,
    select: ['A', 'B', 'C', 'D']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let _this = this;
    const db = wx.cloud.database();
    let detail = JSON.parse(options.detail)
    this.setData({
      detail: detail,
      spinShow: true
    })
    let titleList = detail.titleList.split(';');
    let answerList = detail.answerList.split(';');
    let titleResult = []
    for (let i = 0; i < titleList.length; i++) {
      let result = await this.getIdToTitle(titleList[i]);
      result.result = this.data.select[result.result];
      titleResult.push({ ...result, answer: parseInt(answerList[i]) == -1 ? -1 : this.data.select[parseInt(answerList[i])] })
    }
    this.setData({
      titleResult: titleResult,
      spinShow: false
    })
    db.collection('close').where({
      type: 'closeMutliSelect'
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
  },
  doubleClick: async function (e) {
    let _this = this;
    if (this.data.timeStamp == 0) {
      _this.setData({
        timeStamp: e.timeStamp
      })
      return;
    }
    if (e.timeStamp - this.data.timeStamp < 300) {
      let type = 1;
      let id = e.currentTarget.dataset.id;
      let token = await getUser.getUserToken()
      wx.request({
        url: `http://${app.ip}:5000/exam/exam/addRecordClass/${id}/${type}`,
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
          if (res.data.type == 'Success') {
            $Message({
              content: '添加到错题集成功',
              type: 'success'
            })
          }
          if (res.data.type == 'added') {
            $Message({
              content: '已存在错题集里面',
              type: 'warning'
            })
          }
          if (res.data.type == 'err') {
            $Message({
              content: '未知错误',
              type: 'error'
            })
          }
        },
        fail: function (err) {
          reject(err);
        }
      })
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
        type: 'closeMutliSelect'
      },
      success: function (res) {
        $Message({
          content: '已经设置以后不再提示',
          type: 'warning'
        });
      }
    })
  },
  getIdToTitle: function (id) {
    const db = wx.cloud.database();
    return new Promise((resolve, reject) => {
      db.collection('multiSelect').doc(id).get({
        success: function (res) {
          resolve(res.data);
        }
      })
    })
  }
})