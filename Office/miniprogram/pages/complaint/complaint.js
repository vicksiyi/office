// pages/complaint/complaint.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select: ['违法违禁', '色情', '低俗', '赌博诈骗', '血腥暴力', '人身攻击', '与站内其他视频撞车', '不良封面/标题', '转载/自制类型错误', '引战', '不能参加充电', '青少年不良信息', '有其他问题'],
    maxNumber: 400,//可输入最大字数
    number: 0,//已输入字数
    image: ['https://profile.csdnimg.cn/3/F/2/3_weixin_41593408',
      'https://profile.csdnimg.cn/5/5/5/3_weixin_46199817',
      'https://profile.csdnimg.cn/D/B/1/3_epubit17',
      'https://profile.csdnimg.cn/3/F/2/3_weixin_41593408',
      'https://profile.csdnimg.cn/3/F/2/3_weixin_41593408',
      'https://profile.csdnimg.cn/3/F/2/3_weixin_41593408',
      'https://profile.csdnimg.cn/3/F/2/3_weixin_41593408',
      'https://profile.csdnimg.cn/3/F/2/3_weixin_41593408',
      'https://profile.csdnimg.cn/3/F/2/3_weixin_41593408'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
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
      'number': len
    })
  }
})