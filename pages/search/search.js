// pages/carType/search/search.js

//获取应用实例
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputValue:'', //输入框value值
    StorageFlag: true, //搜索记录
    searcherStorage: [], //历史记录列表
    maxSize: 4, //最大记录数
    school:["清华大学","北京大学"],
    schooldata:'请选择',
    zhuanye:["数学系","计算机系"],
    zhuanyedata:'请选择',
    class:["高等数学","计算机科学"],
    classdata:'请选择'
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    let searchData = wx.getStorageSync('searcher');
    this.setData({ searcherStorage: searchData || [] });
  },

  hideInput() {
    this.setData({ inputValue: ''})    
  },
  bindFocus() { 
    this.setData({ StorageFlag: true })
  },
  bindInput(e) {
    this.setData({ inputValue: e.detail.value })
  },
  clearSearchStorage() { 
    wx.removeStorageSync('searcher')
    this.setData({
      searcherStorage: [],
      StorageFlag: true,
    })
  },
  tapSearcherStorage(e) {
    let index = e.currentTarget.dataset.id;
    let searcherStorage = this.data.searcherStorage;
    let chooseItem = searcherStorage.splice(index, 1)[0];
    this.getResult(chooseItem);
    searcherStorage.unshift(chooseItem);
    this.setData({
      StorageFlag: true,
      searcherStorage: searcherStorage,
      inputValue: chooseItem
    })
    wx.setStorageSync('searcher', searcherStorage);
    wx.navigateTo({
      url: '../searchres/searchres?search='+this.data.inputValue,
    })
  },
  deteleSearcherStorage(e) {
    let index = e.currentTarget.dataset.id;
    let searcherStorage = this.data.searcherStorage;
    searcherStorage.splice(index, 1);
    wx.setStorageSync('searcher', searcherStorage);
    this.setData({ searcherStorage: searcherStorage });
  },
  setSearchStorage(e) { 
    let that = this;
    let inputValue = this.data.inputValue.trim();
    let searchData = that.data.searcherStorage;      
    if (inputValue != '') {
      that.getResult(inputValue);
      searchData = searchData.filter((item) => item !== inputValue);
      if (searchData.length >= this.data.maxSize) searchData.pop();
      searchData.unshift(inputValue);
      wx.setStorageSync('searcher', searchData);
      that.setData({
        StorageFlag: true,
        searcherStorage: searchData
      })
    }
    wx.navigateTo({
      url: '../searchres/searchres?search='+this.data.inputValue,
    })
  },
  getResult(inputVal) { 
    this.triggerEvent("searchEvent",inputVal);
  }
  
})
