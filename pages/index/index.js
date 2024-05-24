// pages/top.js
const app = getApp()

Page({
  onReady() {
    app.login(() => {
      // 用token获取用户数据
      wx.getStorage({
        key: 'access',
        success: (result) => {
          const access = result.data;
          console.log('index：token获得成功');
          wx.request({
            url: 'http://127.0.0.1:8000/api/article/article-list/',
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

  
  tapToSearch: function() {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  tapToDetail() {
    wx.navigateTo({
      url: '../detailpost/detailpost',
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    article:[]
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    app.login(() => {
      // 用token获取用户数据
      wx.getStorage({
        key: 'access',
        success: (result) => {
          const access = result.data;
          console.log('index：token获得成功');
          wx.request({
            url: 'http://127.0.0.1:8000/api/article/article-list/',
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