// components/pop_up.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    showPopup: false,
    text: "",
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    confirm(){
      this.triggerEvent('confirm');
      this.setData({
        showPopup: false
      })
    },
    cancel(){
      this.setData({
        showPopup: false
      })
    }
  }
})