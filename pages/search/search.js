// pages/carType/search/search.js

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:'', //输入框value值
    noData:false, //暂无数据
    carList:[],//搜索列表
    history:false, //搜索记录
    historyData:[], //历史记录列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({ //获取历史记录缓存
      key: 'history', 
      success(res) {
        console.log(res.data)
        if(res.data == ''){
          that.setData({
            history:false
          })
        }else{
          that.setData({
            historyData: res.data,
            history:true
          })
        }
      }
    })
  },

  //搜索框搜索事件
  search:function(e){
    var that = this
    if (e.detail.value == ''){ //输入框value为空
      that.setData({
        noData:false,
        carList:'',
        closeImg:false,
        history:true
      })
    }else{ //输入框value不为空
      that.setData({
        closeImg: true,
        history:false
      })
      $http.post('my/search_vehicles',{ //请求搜索接口
        search: e.detail.value
      }).then(res=>{
        var resObj = res.data
        if(resObj.code == 1){
          //请求成功
          console.log(resObj.data)
          if (resObj.data){
            that.setData({
              noData: false,
              carList: resObj.data.brandList
            })
          }else{
            that.setData({
              noData:true
            })
          }
        }else{
          console.log('请求失败',resObj.msg)
        }
      }).catch(err=>{
        console.log('异常回调',err)
      })
    }
  },

  //点击X取消输入框内容事件
  close: function () {
    var that = this
    that.setData({
      inputValue: '',
      carList:'',
      noData:false,
      closeImg: false,
      history:true
    })
  },

  //取消事件
  cancel: function () {
    var that = this
    wx.switchTab({
      url: '/pages/carType/carType'
    })
  },

  //选择车型事件
  selectCar:function(e){
    var that = this
    console.log(e.target.dataset)
    if (that.data.historyData.indexOf(e.target.dataset.name) > -1) {
      //包含该元素
      } else{
      that.data.historyData.push(e.target.dataset.name)
      }
    wx.setStorage({ //添加缓存
      key: 'history',
      data: that.data.historyData,
      success:function(){
        wx.reLaunch({
          url: '/pages/carType/carType'
        })
      }
    })
  },

  //清空历史搜索
  cancelHistory:function(){
    var that =this
    wx.removeStorage({
      key: 'history',
      success(res) {
        that.setData({
          history:false
        })
      }
    })
  },

  //点击历史搜索
  searchHistory:function(e){
    var that = this
    that.setData({
      inputValue:e.target.dataset.name,
      history:false,
      closeImg:true
    })
    $http.post('url', { //请求搜索接口
      search: e.target.dataset.name
    }).then(res => {
      var resObj = res.data
      if (resObj.code == 1) {
        //请求成功
        console.log(resObj.data)
        if (resObj.data) {
          that.setData({
            noData: false,
            carList: resObj.data.brandList
          })
        } else {
          that.setData({
            noData: true
          })
        }
      } else {
        console.log('请求失败', resObj.msg)
      }
    }).catch(err => {
      console.log('异常回调', err)
    })
  },
  
})
