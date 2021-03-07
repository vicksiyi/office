// pages/radio/radio.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: [],
    select: [],
    current: '',
    position: 'left',
    selected: [],
    num: 0,
    height: 0,
    showFrame: false,
    spinShow: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    let selected_temp = new Array(20).fill(-1)
    wx.getSystemInfo({
      success: (result) => {
        _this.setData({
          height: result.windowHeight
        })
      },
    })
    this.setData({
      selected: selected_temp
    })
    const db = wx.cloud.database()
    db.collection('multiSelect') // 随机获取20道题
      .aggregate()
      .sample({
        size: 20
      })
      .end().then((res) => {
        console.log(res)
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
      num: e.currentTarget.dataset.id,
      showFrame: !this.data.showFrame
    })
  },
  swiperChange: function (e) {
    this.setData({
      num: e.detail.current
    })
  },
  submit: function (e) {
    let result = this.data.title;
    let selected = this.data.selected;
    let error = []
    selected.forEach((value, key) => {
      if (result[key].result != value) {
        error.push(result[key])
      }
    })
    console.log(error);
  },
  clickShow: function (e) {
    this.setData({
      showFrame: !this.data.showFrame
    })
    console.log(this.data.showFrame)
  }
})