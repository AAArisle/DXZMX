// pages/follow/follow.js
const app = getApp()

Page({
  tapToDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../detailpost/detailpost?id='+id,
    })
  },
  Edit() {
    wx.navigateTo({
      url: '../follow2/follow1',
    })
  },

  /**
   * 页面的初始数据
   */
  data: {  
    school:["大学1","大学2","大学3"],
    major:["专业1","专业2","专业3"],
    course:["课程1","课程2","课程3"],
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
    app.login(() => {
      // 用token获取用户数据
      wx.getStorage({
        key: 'access',
        success: (result) => {
          const access = result.data;
          console.log('index：token获得成功');
          wx.request({
            url: 'http://127.0.0.1:8000/api/weixin/tag/',
            method: 'GET',
            header: {
              // 注意字符串 'Bearer ' 尾部有个空格！
              'Authorization': 'Bearer ' + access
            },
            success: res => {
              // 在小程序调试器中查看返回值是否正确
              let articles = JSON.parse(res.data.articles)
              console.log(articles)
              this.setData({
                article: articles
              })
            }
          })
        }
      });
    })
  },
})