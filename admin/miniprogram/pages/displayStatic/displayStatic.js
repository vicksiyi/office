const wxCharts = require("../../utils/wxcharts.js");
var pieChart = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (result) => {
        pieChart = new wxCharts({
          animation: true,
          canvasId: 'pieCanvas',
          type: 'pie',
          series: [{
            name: '已收到',
            data: 0.6,
          }, {
            name: '未收到',
            data: 0.4
          }],
          width: result.windowWidth,
          height: 200,
          dataLabel: true,
        });
      },
    })
  }
})