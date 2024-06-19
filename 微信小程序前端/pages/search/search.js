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
    school:["大学1","大学2","大学3"],
    schoolValue: -1,
    schooldata:'请选择',
    zhuanye:["专业1","专业2","专业3"],
    majorValue: -1,
    zhuanyedata:'请选择',
    class:["课程1","课程2","课程3"],
    courseValue: -1,
    classdata:'请选择',
  },

  schoolChange:function(e){
    this.setData({
      schooldata : this.data.school[e.detail.value],
      schoolValue: e.detail.value
    })
  },
  zhuanyeChange:function(e){
    this.setData({
      zhuanyedata : this.data.zhuanye[e.detail.value],
      majorValue: e.detail.value
    })
  },
  classChange:function(e){
    this.setData({
      classdata : this.data.class[e.detail.value],
      courseValue: e.detail.value
    })
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
      url: '../searchres/searchres?search='+this.data.inputValue+'&school='+this.data.schoolValue+'&major='+this.data.majorValue+'&course='+this.data.courseValue,
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
      url: '../searchres/searchres?search='+this.data.inputValue+'&school='+this.data.schoolValue+'&major='+this.data.majorValue+'&course='+this.data.courseValue,
    })
  },
  getResult(inputVal) { 
    this.triggerEvent("searchEvent",inputVal);
  }
  
})
