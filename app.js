// app.js
App({
  onLaunch() {
    // 这缓存清不掉啊
    // wx.clearStorageSync()
    // wx.removeStorage()

    // 登录
    // this.login()

    // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
  },
  // globalData: {
  //   userInfo: null
  // }

  // 返回布尔值，检查token是否过期
  isTokenAvailable() {
    const now = Date.parse(new Date());
    //同步获取token有效时间
    const accessTime = wx.getStorageSync('access_time')
    if ((accessTime !== '') && (now - accessTime < 5 * 60 * 1000)) {
      return true
    }
    return false
  },

  getToken(callback) {
    console.log('app：从django获得token中')
    wx.login({
      success(res) {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          //发起网络请求
          wx.request({
            // 这里是django的本地ip地址
            // 如果部署到线上，需要改为接口的实际网址
            url: 'http://127.0.0.1:8000/api/weixin/login/',
            method: 'POST',
            data: {
              code: res.code
            },
            success: res => {
              // 在小程序调试器中查看是否收到token
              console.log(res)
              const access = res.data.access
              // 将token保存到缓存
              wx.setStorage({ key: "access", data: access, 
                success: ()=> {
                  console.log('app：token存储成功');
                  // 调用callback
                  // 以便在登录完成后执行后续动作
                  callback()
                } 
              })
              // 保存token的获取时间
              wx.setStorage({
                key: "access_time",
                data: Date.parse(new Date())
              })
            }
          })
        }
        else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

  // 登录函数
  login(callback = (() => {})) {
    if (!this.isTokenAvailable()) {
      console.log('app：从django获得token')
      // 获取token并传入callback
      this.getToken(callback)
    } else {
      console.log('app：从本地缓存获得token')
      // 如果缓存中token未过期则直接执行callback
      callback()
    }
  }
})
