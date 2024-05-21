// pages/history/history.js
Page({

  tapToDetail()
  {
    wx.navigateTo({
      url: '../detailpost/detailpost',
    })
  },
  searchInHistory(e) {
    console.log(e)
  },
  Edit(e) {
    console.log(e)
  },

  /**
   * 页面的初始数据
   */
  data: {  
    userInfo: {  
      nickName: '未设置昵称', // 这里可以保留nickName字段用于其他用途  
      daysAgoViewed: '未设置查看时间' // 初始值，表示还没有计算过时间差  
    }
  },  
  onLoad: function() {  
    var pastTimestamp = 1600000000; // 假设的过去时间戳  
    var currentTimestamp = Math.floor(Date.now() / 1000);  
    var daysDiff = Math.ceil((currentTimestamp - pastTimestamp) / (1000 * 60 * 60 * 24));  
    var daysAgoViewed = daysDiff + '天前看过';  
  
    // 更新data中的userInfo.daysAgoViewed  
    this.setData({  
      userInfo: {  
        ...this.data.userInfo, // 保持userInfo中的其他属性不变  
        daysAgoViewed: daysAgoViewed // 更新daysAgoViewed属性  
      }  
    });

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