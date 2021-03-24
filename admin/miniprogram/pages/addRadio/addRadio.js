const { $Message } = require('../../dist/base/index');
var time = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maxNumber: 100,//可输入最大字数
    number: 0,//已输入字数
    inputText: '',
    result: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  inputText: function (e) {
    let _this = this;
    let value = e.detail.value;
    let len = value.length;
    if (len > this.data.maxNumber) {
      _this.setData({
        'number': this.data.maxNumber
      })
      return;
    }
    this.setData({
      'number': len,
      inputText: value
    })
  },
  radioChange: function (e) {
    this.setData({
      result: e.detail.value
    })
  },
  add: function () {
    let _this = this;
    wx.showLoading({
      title: '正在添加...',
    })
    const db = wx.cloud.database();
    db.collection('radio').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        title: _this.data.inputText,
        result: _this.data.result
      },
      success: function (res) {
        $Message({
          content: '添加成功',
          type: 'success'
        })
        time = setTimeout(() => {
          clearTimeout(time)
          wx.hideLoading()
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      },
      fail:function(err){
        console.log(err)
      }
    })
  },
  onUnload:function(){
    clearTimeout(time)
  }
})