// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switch1: false,
    switch2: false,
    switch3: false,
    spinShow: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this
    const db = wx.cloud.database();
    db.collection('close').where({
      type: 'closeMutliSelect'
    }).get({
      success: function (res) {
        if (res.data.length == 0) {
          _this.setData({
            'switch2': true
          })
        }
      }
    })
    db.collection('close').where({
      type: 'closeRadio'
    }).get({
      success: function (res) {
        if (res.data.length == 0) {
          _this.setData({
            'switch3': true
          })
        }
      }
    })
  },
  onReady: function () {
    this.setData({
      spinShow: false
    })
  },
  onChange(event) {
    let switchNum = `switch${event.currentTarget.dataset.id}`;
    let id = event.currentTarget.dataset.id
    let _this = this;
    const detail = event.detail;
    const db = wx.cloud.database();
    this.setData({
      spinShow: true
    })
    // this.setData({
    //   [switchNum]: detail.value
    // })
    if (id == 2 && !this.data.switch2) {
      db.collection('close').where({
        type: 'closeMutliSelect'
      }).get({
        success: function (res) {
          db.collection('close').doc(res.data[0]._id).remove({
            success: function (e) {
              _this.setData({
                switch2: true,
                spinShow: false
              })
            }
          })
        }
      })
    }
    if (id == 2 && this.data.switch2) {
      db.collection('close').add({
        data: {
          type: 'closeMutliSelect'
        },
        success: function (res) {
          _this.setData({
            switch2: false,
            spinShow: false
          })
        }
      })
    }
    if (id == 3 && !this.data.switch3) {
      db.collection('close').where({
        type: 'closeRadio'
      }).get({
        success: function (res) {
          db.collection('close').doc(res.data[0]._id).remove({
            success: function (e) {
              _this.setData({
                switch3: true,
                spinShow: false
              })
            }
          })
        }
      })
    }
    if (id == 3 && this.data.switch3) {
      db.collection('close').add({
        data: {
          type: 'closeRadio'
        },
        success: function (res) {
          _this.setData({
            switch3: false,
            spinShow: false
          })
        }
      })
    }
  }
})