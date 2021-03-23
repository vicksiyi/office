const app = getApp()
const getUser = require('../../utils/getUser');
const { $Message } = require('../../dist/base/index');
var time = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select: [],
    maxNumber: 100,//可输入最大字数
    number: 0,//已输入字数
    image: [],
    inputText: '',
    timeStamp: 0,
    selected: 0,
    videoId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let result = await this.getClass();
    this.setData({
      select: result,
      videoId: options.id
    })
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
      inputText: e.detail.value
    })
  },
  getClass: function () {
    let _this = this;
    this.setData({
      spinShow: true
    })
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://${app.ip}:5000/complaint/service/getClass`,
        method: 'GET',
        success: async function (res) {
          if (res.data == "Unauthorized") {
            wx.removeStorage({
              key: 'Token',
            })
            wx.redirectTo({
              url: '../../pages/auth/auth',
            })
          }
          _this.setData({
            spinShow: false
          })
          if (res.data.type == "Success") {
            resolve(res.data.complaintClass);
          }
        },
        fail: function (err) {
          reject(err);
        }
      })
    });
  },
  submit: async function () {
    let _this = this;
    let image = this.data.image;
    wx.showLoading({
      title: '提交中...',
      mask: true
    })
    for (let i = 0; i < image.length; i++) {
      image[i] = await this.uploadImage(image[i], i);
    }
    let token = await getUser.getUserToken();
    wx.request({
      url: `http://${app.ip}:5000/complaint/service/add`,
      method: 'POST',
      data: {
        imageList: _this.data.image.join(';'),
        msg: _this.data.inputText,
        videoId: _this.data.videoId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': token
      },
      success: async function (res) {
        if (res.data == "Unauthorized") {
          wx.removeStorage({
            key: 'Token',
          })
          wx.redirectTo({
            url: '../../pages/auth/auth',
          })
        }
        if (res.data.type == 'Success') {
          $Message({
            content: '稿件投诉成功',
            type: 'success'
          })
        }
        if (res.data.type == 'err') {
          $Message({
            content: '未知错误',
            type: 'error'
          })
        }
        time = setTimeout(() => {
          wx.hideLoading()
          wx.navigateBack({
            delta: 1,
          })
          clearTimeout(time);
        }, 1000)
      },
      fail: function (err) {
        reject(err);
      }
    })
  },
  uploadImage: async function (image, key) {
    let _this = this;
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: image,
        async success(res) {
          let result = await _this.uploadImageFile(res.path, key);
          resolve(result);
        }
      })
    })
  },
  uploadImageFile: function (path, key) {
    let _this = this;
    return new Promise((resolve, reject) => {
      wx.cloud.uploadFile({
        cloudPath: `complaint/${Date.parse(new Date()) + key}.png`, // 上传至云端的路径
        filePath: path,
        success: res2 => {
          resolve(res2.fileID)
        },
        fail: console.error
      })
    })
  },
  addImage: function () {
    let _this = this;
    wx.showLoading({
      title: '上传中...',
      mask: true
    })
    wx.chooseImage({
      count: 9,
      success(res) {
        let image = _this.data.image;
        if (image.length + res.tempFilePaths.length > 9) {
          $Message({
            content: '只能选9张以下图片',
            type: 'warning'
          })
          let numTemp = 9 - image.length;
          image.push(res.tempFilePaths.slice(0, numTemp));
        } else {
          image.push(...res.tempFilePaths);
        }
        _this.setData({
          image: image,
          imageNum: image.length
        })
        wx.hideLoading()
      },
      fail: function (err) {
        $Message({
          content: '用户取消',
          type: 'warning'
        })
        wx.hideLoading()
      }
    })
  },
  doubleClick: function (e) {
    let _this = this;
    if (this.data.timeStamp == 0) {
      _this.setData({
        timeStamp: e.timeStamp
      })
      return;
    }
    if (e.timeStamp - this.data.timeStamp < 300) {
      let image = _this.data.image;
      image.splice(e.currentTarget.dataset.index, 1);
      _this.setData({
        image: image
      })
      $Message({
        content: '删除成功',
        type: 'success'
      })
    }
    _this.setData({
      timeStamp: 0
    })
  },
  radioChange: function (e) {
    this.setData({
      selected: e.detail.value
    })
  },
  onUnload: function () {
    clearTimeout(time);
  }
})