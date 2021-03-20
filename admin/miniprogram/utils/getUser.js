exports.getUserToken = function () {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: 'Token',
      success: function (res) {
        resolve(res.data)
      },
      fail: function (err) {
        resolve('error')
      }
    })
  });
}

exports.getTempUrl = function (url) {
  return new Promise((resolve, reject) => {
    wx.cloud.getTempFileURL({
      fileList: [url],
      success: res => {
        resolve(res.fileList);
      },
      fail: console.error
    })
  })
}