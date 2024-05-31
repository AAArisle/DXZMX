// pages/top.js
const app = getApp()

Page({  
  tapToSearch: function() {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  tapToDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../detailpost/detailpost?id='+id,
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    article:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      search: options.search,
    })
    app.login(() => {
      // 用token获取用户数据
      wx.getStorage({
        key: 'access',
        success: (result) => {
          const access = result.data;
          console.log('index：token获得成功');
          wx.request({
            url: 'http://127.0.0.1:8000/api/article/article-list/?search='+this.data.search,
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