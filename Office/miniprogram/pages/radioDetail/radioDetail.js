const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeStamp: 0,
    isTips: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    const db = wx.cloud.database();
    db.collection('close').where({
      type: 'closeRadio'
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
        type: 'closeRadio'
      },
      success: function (res) {
        $Message({
          content: '已经设置以后不再提示',
          type: 'warning'
        });
      }
    })
  }
})