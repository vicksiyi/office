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
    result: 0,
    number1: 0,
    number2: 0,
    number3: 0,
    number4: 0,
    inputText1: '',
    inputText2: '',
    inputText3: '',
    inputText4: '',
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
  inputText1: function (e) {
    let _this = this;
    let value = e.detail.value;
    let len = value.length;
    if (len > this.data.maxNumber) {
      _this.setData({
        'number1': this.data.maxNumber
      })
      return;
    }
    this.setData({
      'number1': len,
      inputText1: value
    })
  },
  inputText2: function (e) {
    let _this = this;
    let value = e.detail.value;
    let len = value.length;
    if (len > this.data.maxNumber) {
      _this.setData({
        'number2': this.data.maxNumber
      })
      return;
    }
    this.setData({
      'number2': len,
      inputText2: value
    })
  },
  inputText3: function (e) {
    let _this = this;
    let value = e.detail.value;
    let len = value.length;
    if (len > this.data.maxNumber) {
      _this.setData({
        'number3': this.data.maxNumber
      })
      return;
    }
    this.setData({
      'number3': len,
      inputText3: value
    })
  },
  inputText4: function (e) {
    let _this = this;
    let value = e.detail.value;
    let len = value.length;
    if (len > this.data.maxNumber) {
      _this.setData({
        'number4': this.data.maxNumber
      })
      return;
    }
    this.setData({
      'number4': len,
      inputText4: value
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
    db.collection('multiSelect').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        title: _this.data.inputText,
        result: _this.data.result,
        A: _this.data.inputText1,
        B: _this.data.inputText2,
        C: _this.data.inputText3,
        D: _this.data.inputText4
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
      fail: function (err) {
        console.log(err)
      }
    })
  },
  onUnload: function () {
    clearTimeout(time)
  }
})