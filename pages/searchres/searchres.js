// pages/top.js
const app = getApp()

Page({
  tapToSearch: function () {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  tapToDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../detailpost/detailpost?id=' + id,
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    schoolList:["大学1","大学2","大学3"],
    school:'-1',
    majorList:["专业1","专业2","专业3"],
    major:'-1',
    courseList:["课程1","课程2","课程3"],
    course:'-1',
    article: [{
      fields: {
        author: '',
        updated: '',
        title: '标题',
        body: '经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情',
      },
      school_name: '大学名称',
      avatar_url: '../../images/user.png',
      school_logo: '../../images/大学/暨南大学.png'
    }, {
      fields: {
        author: '',
        updated: '',
        title: '标题',
        body: '经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情经验内容详情',
        tags: Array.from({
          length: 7
        }).map(() => 'tag1')
      },
      school_name: '大学名称',
      avatar_url: '../../images/user.png',
      school_logo: '../../images/大学/暨南大学.png'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      search: options.search,
      school: options.school,
      major: options.major,
      course: options.course
    })
    app.login(() => {
      // 用token获取用户数据
      wx.getStorage({
        key: 'access',
        success: (result) => {
          const access = result.data;
          console.log('index：token获得成功');
          wx.request({
            url: 'http://127.0.0.1:8000/api/article/article-list/?search='+this.data.search+'&school='+this.data.school+'&major='+this.data.major+'&course='+this.data.course,
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