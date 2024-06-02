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
                "userInfo.sex": res.data.sex,
                "userInfo.email": res.data.email,
                "userInfo.school": res.data.school,
                "userInfo.grade": res.data.grade,
                "userInfo.major": res.data.major,

                "newUserInfo.avatarUrl": res.data.avatar_url,
                "newUserInfo.nickName": res.data.nickname,
                "newUserInfo.sex": res.data.sex,
                "newUserInfo.email": res.data.email,
                "newUserInfo.school": res.data.school,
                "newUserInfo.grade": res.data.grade,
                "newUserInfo.major": res.data.major,
              })
            }
          })
        }
      });
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    const { nickName } = this.data.userInfo
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      hasUserInfo: nickName && avatarUrl && avatarUrl != defaultAvatarUrl,
    })
  },
  onClickUserMessageEdit(){
    this.setData({
      editing: true,
    })
  },
  onClickUserMessageCheck(){
    this.setData({
      editing: false,
      userInfo: {...this.data.newUserInfo},
    })
    this.uploadData()
  },
  onClickUserMessageClose(){
    this.setData({
      editing: false,
      newUserInfo: {...this.data.userInfo},
    })
  },
  
  uploadData() {
    if (this.data.hasUserInfo){
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
            wx.uploadFile({
              url: 'http://127.0.0.1:8000/api/weixin/data/',
              filePath: this.data.userInfo.avatarUrl,
              name: 'avatarUrl',
              method: 'POST',
              header: {
                'Authorization': 'Bearer ' + access
              },
            })
          }
        })
      })
    }
  },

  onNickNameInput(e) {
    const nickName = e.detail.value
    const { avatarUrl } = this.data.userInfo
    if(nickName != ""){
      this.setData({
        "newUserInfo.nickName": nickName,
        hasUserInfo: nickName && avatarUrl && avatarUrl != defaultAvatarUrl,
      })
    }
  },
  onEmailInput(e) {
    this.setData({
      "newUserInfo.email": e.detail.value,
    })
  },
  sexChange:function(e){
    this.setData({
      "newUserInfo.sex" : this.data.sexRange[e.detail.value]
    })
  },
  schoolChange:function(e){
    this.setData({
      "newUserInfo.school" : this.data.schoolRange[e.detail.value]
    })
  },
  gradeChange:function(e){
    this.setData({
      "newUserInfo.grade" : this.data.gradeRange[e.detail.value]
    })
  },
  majorChange:function(e){
    this.setData({
      "newUserInfo.major" : this.data.majorRange[e.detail.value]
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    editing: false,
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
      sex: '未知',
      email: '',
      school: '',
      grade: '',
      major: '',
    },
    newUserInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
      sex: '未知',
      email: '',
      school: '',
      grade: '',
      major: '',
    },
    hasUserInfo: true,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
    sexRange: ["未知","男","女"],
    schoolRange:["大学1","大学2","大学3"],
    gradeRange:["大一","大二","大三","大四"],
    majorRange:["专业1","专业2","专业3"],
  },
})