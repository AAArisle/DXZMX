// pages/myprofile/myprofile.js

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  onReady() {
    wx.getStorage({
      key: 'access',
      success: (result) => {
        const access = result.data;
        wx.request({
          url: 'http://127.0.0.1:8000/api/weixin/data/',
          header: {
            // 注意字符串 'Bearer ' 尾部有个空格！
            'Authorization': 'Bearer ' + access
          },
          success: res => {
            // 在小程序调试器中查看返回值是否正确
            this.setData({
              "userInfo.avatarUrl": res.data.avatar_url,
              "userInfo.nickName": res.data.nickname,
            })
          }
        })
      }
    });
  },
  onChooseAvatar(e) {
    this.setData({
      "userInfo.avatarUrl": e.detail,
    })
    this.uploadData()
  },
  onNickNameInput(e) {
    const nickName = e.detail.value
    if(nickName != ""){
      this.setData({
        "userInfo.nickName": nickName,
      })
      this.uploadData()
    }
    else{
      this.setData({
        "userInfo.nickName": this.data.userInfo.nickName,
      })
    }
  },
  uploadData() {
    wx.getStorage({
      key: 'access',
      success: (result) => {
        const access = result.data;
        wx.request({
          url: 'http://127.0.0.1:8000/api/weixin/data/',
          method: 'POST',
          header: {
            'Authorization': 'Bearer ' + access
          },
          data: {
            userInfo: this.data.userInfo
          }
        })
      }
    })
  },
  onClickUserMessageEdit(){
    if(this.data.inputDisabled.nickName){
      this.setData({
        "inputDisabled.nickName": false,
        "userMesaageEditIcon": "edit-off",
      })
    }
    else{
      this.setData({
        "inputDisabled.nickName": true,
        "userMesaageEditIcon": "edit-2",
      })
    }
  },

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    userMesaageEditIcon: "edit-2",
    inputDisabled:{
      nickName: true
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})