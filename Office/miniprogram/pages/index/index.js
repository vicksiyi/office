//index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 'video',
    load: false,
    height: 0,
    data: {
      "video": [
        {
          "url": "https://emoji.cdn.bcebos.com/yunque/hejirukou.jpg",
          "tag": "Office",
          "msg": "考研失败并不代表你输了人生【天降】",
          "time": "21:35"
        },
        {
          "url": "https://emoji.cdn.bcebos.com/yunque/hejirukou.jpg",
          "tag": "Office",
          "msg": "考研失败并不代表你输了人生【天降】",
          "time": "21:35"
        },
        {
          "url": "https://emoji.cdn.bcebos.com/yunque/hejirukou.jpg",
          "tag": "Office",
          "msg": "考研失败并不代表你输了人生【天降】",
          "time": "21:35"
        },
        {
          "url": "https://emoji.cdn.bcebos.com/yunque/hejirukou.jpg",
          "tag": "Office",
          "msg": "考研失败并不代表你输了人生【天降】",
          "time": "21:35"
        }
      ],
      "news": [
        {
          "url": "https://p9.pstatp.com/list/240x240/tos-cn-i-0022/85cf0ef52f3642fa83675282bfc05bba",
          "title": "2013年，郭晶晶生了大儿子，霍家奖励1亿现金、2亿豪宅2017年，郭晶晶生了二女儿，霍家奖励10亿现金",
          "good": "100",
          "msg": "99",
          "look": "100"
        },
        {
          "url": "https://p9.pstatp.com/list/240x240/tos-cn-i-0022/85cf0ef52f3642fa83675282bfc05bba",
          "title": "2013年，郭晶晶生了大儿子，霍家奖励1亿现金、2亿豪宅2017年，郭晶晶生了二女儿，霍家奖励10亿现金",
          "good": "100",
          "msg": "99",
          "look": "100"
        },
        {
          "url": "https://p9.pstatp.com/list/240x240/tos-cn-i-0022/85cf0ef52f3642fa83675282bfc05bba",
          "title": "2013年，郭晶晶生了大儿子，霍家奖励1亿现金、2亿豪宅2017年，郭晶晶生了二女儿，霍家奖励10亿现金",
          "good": "100",
          "msg": "99",
          "look": "100"
        },
        {
          "url": "https://p9.pstatp.com/list/240x240/tos-cn-i-0022/85cf0ef52f3642fa83675282bfc05bba",
          "title": "2013年，郭晶晶生了大儿子，霍家奖励1亿现金、2亿豪宅2017年，郭晶晶生了二女儿，霍家奖励10亿现金",
          "good": "100",
          "msg": "99",
          "look": "100"
        },
        {
          "url": "https://p9.pstatp.com/list/240x240/tos-cn-i-0022/85cf0ef52f3642fa83675282bfc05bba",
          "title": "2013年，郭晶晶生了大儿子，霍家奖励1亿现金、2亿豪宅2017年，郭晶晶生了二女儿，霍家奖励10亿现金",
          "good": "100",
          "msg": "99",
          "look": "100"
        }
      ],
      "eaxm": []
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    wx.getSystemInfo({
      success: (result) => {
        _this.setData({
          height: result.windowHeight - 42
        })
      },
    })
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  handleChange({ detail }) {
    this.setData({
      current: detail.key
    });
  },
  nav:function(e){
    wx.navigateTo({
      url: '../video/video?id=',
    })
  }
})