exports.getUserInfo = function () {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        resolve(res.data)
      },
      fail:function(err){
        resolve('error')
        console.log(err)
      }
    })
  });
}

exports.getUserToken = function () {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'Token',
      success: function (res) {
        resolve(res.data)
      },
      fail:function(err){
        resolve('error')
      }
    })
  });
}