const { $Message } = require('../../dist/base/index');
const app = getApp();
const base64 = require('../../utils/base64');
const getUser = require('../../utils/getUser');
var time = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: [],
    showItem: true,
    maxNumber: 100,//可输入最大字数
    number: 0,//已输入字数
    imageNum: 0,
    userInfo: '',
    reviewText: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let userInfo = await getUser.getUserInfo();
    this.setData({
      userInfo: userInfo
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
      'reviewText': value
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
    let userInfo = JSON.parse(_this.data.userInfo);
    return new Promise((resolve, reject) => {
      wx.cloud.uploadFile({
        cloudPath: `customerService/${Date.parse(new Date()) + base64.encode(userInfo.nickName) + key}.png`, // 上传至云端的路径
        filePath: path,
        success: res2 => {
          resolve(res2.fileID)
        },
        fail: console.error
      })
    })
  },
  submit: async function () {
    let imageList = '';
    let reviewText = this.data.reviewText;
    wx.showLoading({
      title: '正在提交',
      mask: true
    })
    let image = this.data.image;
    for (let i = 0; i < image.length; i++) {
      let imageTemp = await this.uploadImage(image[i], i);
      imageList += i == image.length - 1 ? imageTemp : imageTemp + ';'
    }
    let token = await getUser.getUserToken()
    wx.request({
      url: `http://${app.ip}:5000/customer/service/add`,
      method: 'POST',
      data: {
        imageList: imageList,
        msg: reviewText
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
            content: '反馈成功',
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
  onUnload: function () {
    clearTimeout(time);
  }
})