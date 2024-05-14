// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const app = getApp()

Page({
  onReady() {
    app.login(() => {
      // 用token获取用户数据
      console.log('login：从django获得data中')
      wx.getStorage({
        key: 'access',
        success: (result) => {
          const access = result.data;
          console.log('login：token获得成功');
          console.log(access);
          wx.request({
            url: 'http://127.0.0.1:8000/api/weixin/data/',
            header: {
              // 注意字符串 'Bearer ' 尾部有个空格！
              'Authorization': 'Bearer ' + access
            },
            success: res => {
              // 在小程序调试器中查看返回值是否正确
              console.log(res)
              this.setData({
                "userInfo.avatarUrl": res.data.avatar_url,
                "userInfo.nickName": res.data.nickname,
                hasUserInfo: res.data.nickname && res.data.avatar_url && res.data.avatar_url !== defaultAvatarUrl,
              })
            }
          })
        }
      });
    })
  },

  data: {
    userInfo: {
      avatarUrl: defaultAvatarUrl,
      nickName: '',
    },
    hasUserInfo: false,
    canIUseGetUserProfile: wx.canIUse('getUserProfile'),
    canIUseNicknameComp: wx.canIUse('input.type.nickname'),
  },

  // 将清单数据提交到django
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
          }
        })
      })
    }
  },

  bindViewTap() {
    wx.switchTab({
      url: '../index/index'
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    const { nickName } = this.data.userInfo
    this.setData({
      "userInfo.avatarUrl": avatarUrl,
      hasUserInfo: nickName && avatarUrl && avatarUrl != defaultAvatarUrl,
    })
    this.uploadData()
  },
  onInputChange(e) {
    const nickName = e.detail.value
    const { avatarUrl } = this.data.userInfo
    this.setData({
      "userInfo.nickName": nickName,
      hasUserInfo: nickName && avatarUrl && avatarUrl != defaultAvatarUrl,
    })
    this.uploadData()
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
})