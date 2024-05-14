// pages/myprofile/myprofile.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const app = getApp()

Page({
  onReady() {
    app.login(() => {
      wx.getStorage({
        key: 'access',
        success: (result) => {
          const access = result.data;
          wx.request({
            url: 'http://127.0.0.1:8000/api/weixin/data/',
            header: {
              'Authorization': 'Bearer ' + access
            },
            success: res => {
              this.setData({
                "userInfo.avatarUrl": res.data.avatar_url,
                "userInfo.nickName": res.data.nickname,
              })
            }
          })
        }
      });
    })
  },
  onChooseAvatar(e) {
    this.setData({
      "userInfo.avatarUrl": e.detail,
    })
  },
  onNickNameInput(e) {
    const nickName = e.detail.value
    if(nickName != ""){
      this.setData({
        "userInfo.nickName": nickName,
      })
    }
    else{
      this.setData({
        "userInfo.nickName": this.data.userInfo.nickName,
      })
    }
  },
  uploadData() {
    app.login(() => {
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
})