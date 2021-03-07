Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardList: [
      {
        'title': '个人信息',
        'logo': '../../images/me/person.png',
        'nav': '../information/information'
      },
      {
        'title': '我的关注',
        'logo': '../../images/me/focus.png',
        'nav': '../focus/focus'
      },
      {
        'title': '我的收藏',
        'logo': '../../images/me/collection.png',
        'nav': '../collection/collection'
      },
      {
        'title': '我的视频',
        'logo': '../../images/me/video.png',
        'nav': '../myvideo/myvideo'
      },
      {
        'title': '反馈/客服',
        'logo': '../../images/me/customerService.png',
        'nav': '../customerService/customerService'
      }, {
        'title': '设置',
        'logo': '../../images/me/setting.png',
        'nav': '../setting/setting'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  nav: function (res) {
    console.log(this.data.cardList[res.currentTarget.dataset.id].nav)
    wx.navigateTo({
      url: `${this.data.cardList[res.currentTarget.dataset.id].nav}`
    })
  }
})