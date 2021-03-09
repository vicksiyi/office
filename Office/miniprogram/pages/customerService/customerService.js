// pages/customerService/customerService.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: ['https://profile.csdnimg.cn/3/F/2/3_weixin_41593408',
      'https://profile.csdnimg.cn/5/5/5/3_weixin_46199817',
      'https://profile.csdnimg.cn/D/B/1/3_epubit17',
      'https://profile.csdnimg.cn/3/F/2/3_weixin_41593408',
      'https://profile.csdnimg.cn/3/F/2/3_weixin_41593408',
      'https://profile.csdnimg.cn/3/F/2/3_weixin_41593408',
      'https://profile.csdnimg.cn/3/F/2/3_weixin_41593408',
      'https://profile.csdnimg.cn/3/F/2/3_weixin_41593408',
      'https://profile.csdnimg.cn/3/F/2/3_weixin_41593408'],
    showItem: false,
    maxNumber: 100,//可输入最大字数
    number: 0,//已输入字数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  inputText: function (e) { //监听输入，实时改变已输入字数
    let value = e.detail.value;//获取textarea的内容，
    let len = value.length;//获取textarea的内容长度
    this.setData({
      'number': len
    })
  }
})