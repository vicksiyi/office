const app = getApp()
const getUser = require('../../utils/getUser');
const { $Message } = require('../../dist/base/index');
var returnOut = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: [],
    select: ['错误', '正确'],
    current: '',
    position: 'left',
    selected: [],
    num: 0,
    spinShow: true,
    numTime: 3,
    result: 0,
    showResult: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    let selected_temp = new Array(20).fill(-1)
    this.setData({
      selected: selected_temp
    })
    const db = wx.cloud.database()
    db.collection('radio')
      .aggregate()
      .sample({
        size: 20
      })
      .end().then(res => {
        _this.setData({
          title: res.list,
          spinShow: false
        })
      })
  },
  radioChange: function (e) {
    let selected = `selected[${e.currentTarget.dataset.index}]`
    this.setData({
      [selected]: e.detail.value
    })
  },
  next: function () {
    this.setData({
      num: this.data.num + 1
    })
  },
  selectNum: function (e) {
    this.setData({
      num: e.currentTarget.dataset.id
    })
  },
  swiperChange: function (e) {
    this.setData({
      num: e.detail.current
    })
  },
  submit: async function (e) {
    let _this = this;
    let title = this.data.title;
    let selected = this.data.selected;
    let error = []
    let result = 0;
    let titleList = '';
    let answerList = '';
    let type = 0;
    let token = await getUser.getUserToken();
    selected.forEach((value, key) => {
      titleList += key == title.length - 1 ? title[key]._id : title[key]._id + ';';
      answerList += key == title.length - 1 ? value : value + ';';
      if (title[key].result != value) {
        error.push(title[key])
      } else {
        result += 5;
      }
    })
    this.setData({
      result: result,
      showResult: true
    })
    returnOut = setInterval(() => {
      if (this.data.numTime <= 0) {
        clearInterval(returnOut);
        wx.navigateBack({
          delta: 1,
        })
        return;
      }
      _this.setData({
        numTime: this.data.numTime - 1
      })
    }, 1000);
    wx.request({
      url: `http://${app.ip}:5000/exam/exam/add`,
      method: 'POST',
      data: {
        result: result,
        titleList: titleList,
        answerList: answerList,
        type: type
      },
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
        if (res.data.type == "Success") {
          $Message({
            content: '提交成功',
            type: 'success'
          })
        }
      }
    })
  },
  onUnload: function () {
    clearInterval(returnOut);
  }
})