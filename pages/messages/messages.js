// pages/messages/messages.js
Page({
  tapToDetail()
  {
    wx.navigateTo({
      url: '../detailpost/detailpost',
    })
  },
  
  /**
   * 页面的初始数据
   */
  data: {
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
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})