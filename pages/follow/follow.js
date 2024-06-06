// pages/follow/follow.js
Page({
  data: {
    experience: [
      {
        schoolLogo: '../../images/大学/暨南大学.png',
        avatarUrl: '../../images/user.png',
        username: '用户1',
        schoolName: '大学1',
        title: '经验标题1',
        content: '经验内容1',
        views: 123,
        comments: 45,
        likes: 67
      },
      {
        schoolLogo: '../../images/大学/暨南大学.png',
        avatarUrl: '../../images/user.png',
        username: '用户2',
        schoolName: '大学2',
        title: '经验标题2',
        content: '经验内容2',
        views: 456,
        comments: 78,
        likes: 89
      }
    ]
  },
  onSearchFocus: function() {
    wx.navigateTo({
      url: '/pages/search/search'
    });
  }
});

