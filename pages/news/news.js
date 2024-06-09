// pages/news/news.js
const app = getApp()

Page({
  tapToMessages()
  {
    wx.navigateTo({
      url: '../messages/messages',
    })
  },
  tapToDetail(e) {
    let id = e.currentTarget.dataset.id
    let ntid = e.currentTarget.dataset.ntid
    app.login(() => {
      // 用token获取用户数据
      wx.getStorage({
        key: 'access',
        success: (result) => {
          const access = result.data;
          console.log('index：token获得成功');
          wx.request({
            url: 'http://127.0.0.1:8000/notice/update/?notice_id='+ntid,
            method: 'GET',
            header: {
              // 注意字符串 'Bearer ' 尾部有个空格！
              'Authorization': 'Bearer ' + access
            },
          })
        }
      });
    })
    wx.navigateTo({
      url: '../detailpost/detailpost?id='+id,
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    notices:[],
    news: [{
      initiator_id: 1,
      name: "暨南大学",
      icon: "../../images/大学/暨南大学.png",
      haveUnread: true,
      num: 1,
      date: "2024-5-20",
    },
    {
      initiator_id: 0,
      name: "系统通知",
      icon: "../../images/系统通知.png",
      haveUnread: false,
      num: 1,
      date: "2024-5-20",
    }],
    initiator: {
      name: "暨南大学",
      icon: "../../images/大学/暨南大学.png",
    },
    messages: [{
      id: 3,
      date: "2024-5-20",
      title: "新内容发布",
      body: "点击前往详情界面"
    },
    {
      id: 2,
      date: "2024-5-20",
      title: "新内容发布",
      body: "点击前往详情界面"
    },
    {
      id: 1,
      date: "2024-5-20",
      title: "新内容发布",
      body: "点击前往详情界面"
    },
    {
      id: 0,
      date: "2024-5-20",
      title: "新内容发布",
      body: "点击前往详情界面"
    }]
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
            url: 'http://127.0.0.1:8000/notice/list/',
            method: 'GET',
            header: {
              // 注意字符串 'Bearer ' 尾部有个空格！
              'Authorization': 'Bearer ' + access
            },
            success: res => {
              let notices = JSON.parse(res.data.notices)
              console.log(notices)
              this.setData({
                notices: notices
              })
            }
          })
        }
      });
    })
  },
})