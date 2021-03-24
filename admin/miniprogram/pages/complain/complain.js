const app = getApp();
const getUser = require('../../utils/getUser');
const { $Message } = require('../../dist/base/index');
const formatTime = require('../../utils/formatTime');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    spinShow: false,
    token: '',
    complaint: [],
    height: 0,
    start: 0,
    showRight: false,
    complaintClass: {},
    videoId: '',
    isShowVideo: false,
    videoUrl: '',
    id: '',
    complaintIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let _this = this;
    let complaintClass = await this.getComplaintClass();
    let complaint = await this.getComplaint(0, complaintClass);
    wx.getSystemInfo({
      success: (result) => {
        _this.setData({
          height: result.windowHeight
        })
      },
    })
    this.setData({
      complaint: complaint
    })
  },
  getComplaint: async function (start, complaintClass) {
    let _this = this;
    this.setData({
      spinShow: true
    })
    let token = await getUser.getUserToken()
    this.setData({
      token: token
    })
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://${app.ip}:5001/admin/complaint/getComplaint/${start}`,
        method: 'GET',
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
              url: '../../pages/login/login',
            })
          }
          _this.setData({
            spinShow: false
          })
          if (res.data.type == 'Success') {
            for (let i = 0; i < res.data.complaint.length; i++) {
              res.data.complaint[i].time = formatTime.changeTime(res.data.complaint[i].time);
              res.data.complaint[i].imageList = res.data.complaint[i].imageList.split(';');
              res.data.complaint[i].class = complaintClass[res.data.complaint[i].classId];
            }
            resolve(res.data.complaint);
          }
        },
        fail: function (err) {
          reject(err);
        }
      })
    }).catch((err) => {
      wx.switchTab({
        url: '../../pages/login/login',
      })
    })
  },
  tolower: async function () {
    let _this = this;
    let start = this.data.start + 1;
    let data = await this.getComplaint(start);
    let resource = this.data.complaint;
    resource.push(...data)
    if (data.length == 0) {
      $Message({
        content: '底线到了...',
        type: 'warning'
      })
      return;
    }
    this.setData({
      complaint: resource,
      start: start
    })
  },
  toggleRight: function (e) {
    this.setData({
      showRight: !this.data.showRight,
      imageList: e.currentTarget.dataset.imagelist,
      videoId: e.currentTarget.dataset.videoid,
      id: e.currentTarget.dataset.id
    })
  },
  showImage: function (e) {
    let url = e.currentTarget.dataset.url;
    wx.previewImage({
      current: url,
      urls: [url]
    })
  },
  getComplaintClass: async function () {
    let _this = this;
    this.setData({
      spinShow: true
    })
    let token = await getUser.getUserToken();
    _this.setData({
      token: token
    })
    return new Promise((resolve, reject) => {
      wx.request({
        url: `http://${app.ip}:5001/admin/complaint/getClass`,
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': token
        },
        success: function (res) {
          if (res.data == "Unauthorized") {
            wx.removeStorage({
              key: 'Token',
            })
            wx.redirectTo({
              url: '../../pages/login/login',
            })
          }
          if (res.data.type == 'Success') {
            let complaintClass = {}
            for (let i = 0; i < res.data.complaintClass.length; i++) {
              complaintClass[res.data.complaintClass[i]._id] = res.data.complaintClass[i]
            }
            resolve(complaintClass);
          }
          _this.setData({
            spinShow: false
          })
        },
        fail: function (err) {
          reject(err);
        }
      })
    })
  },
  showVideo: function (e) {
    let _this = this;
    if (_this.data.isShowVideo == false) {
      _this.setData({
        spinShow: true
      })
      wx.request({
        url: `http://${app.ip}:5001/admin/video/getOneVideo/${_this.data.videoId}`,
        method: 'GET',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': _this.data.token
        },
        success: function (res) {
          if (res.data == "Unauthorized") {
            wx.removeStorage({
              key: 'Token',
            })
            wx.redirectTo({
              url: '../../pages/login/login',
            })
          }
          if (res.data.type == 'Success') {
            _this.setData({
              videoUrl: res.data.profile.videoUrl,
              isShowVideo: true
            })
          }
          if (res.data.type == 'deled') {
            $Message({
              content: '视频已被删除',
              type: 'warning'
            })
            _this.setData({
              isShowVideo: false
            })
          }
          _this.setData({
            spinShow: false
          })
        },
        fail: function (err) {
          reject(err);
        }
      })
    }
  },
  closeVideo: function () {
    this.setData({
      isShowVideo: false
    })
  },
  delVideo: function () {
    let _this = this;
    _this.setData({
      spinShow: true
    })
    wx.request({
      url: `http://${app.ip}:5001/admin/video/delVideo/${_this.data.videoId}`,
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': _this.data.token
      },
      success: function (res) {
        if (res.data == "Unauthorized") {
          wx.removeStorage({
            key: 'Token',
          })
          wx.redirectTo({
            url: '../../pages/login/login',
          })
        }
        if (res.data.type == 'Success') {
          $Message({
            content: '删除成功',
            type: 'success'
          })
        }
        if (res.data.type == 'deled') {
          $Message({
            content: '视频已被删除',
            type: 'warning'
          })
        }
        _this.setData({
          spinShow: false
        })
      },
      fail: function (err) {
        reject(err);
      }
    })
  },
  doneComplaint: function () {
    let _this = this;
    _this.setData({
      spinShow: true
    })
    wx.request({
      url: `http://${app.ip}:5001/admin/complaint/modifyComplaint/${_this.data.id}`,
      method: 'GET',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': _this.data.token
      },
      success: function (res) {
        if (res.data == "Unauthorized") {
          wx.removeStorage({
            key: 'Token',
          })
          wx.redirectTo({
            url: '../../pages/login/login',
          })
        }
        if (res.data.type == 'Success') {
          let complaint = _this.data.complaint;
          complaint.splice(_this.data.complaintIndex, 1);
          _this.setData({
            complaint: complaint,
            showRight: false
          })
          $Message({
            content: '成功处理',
            type: 'success'
          })
        }
        _this.setData({
          spinShow: false
        })
      },
      fail: function (err) {
        reject(err);
      }
    })
  },
  nav:function(){
    wx.navigateTo({
      url: '../../pages/complainClass/complainClass',
    })
  }
})