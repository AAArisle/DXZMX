// pages/addpost/addpost.js
const app = getApp()

Page({
  // 页面的初始数据
  data: {
    mypath: '../../images/upload.png',
    school:["清华大学","北京大学"],
    schooldata:'请选择',
    zhuanye:["数学系","计算机系"],
    zhuanyedata:'请选择',
    class:["高等数学","计算机科学"],
    classdata:'请选择'
  },

  schoolChange:function(e){
    this.setData({
      schooldata : this.data.school[e.detail.value]
    })
  },
  zhuanyeChange:function(e){
    this.setData({
      zhuanyedata : this.data.zhuanye[e.detail.value]
    })
  },
  classChange:function(e){
    this.setData({
      classdata : this.data.class[e.detail.value]
    })
  },
  upload:function(){
    var that = this
    wx.chooseMedia({
      count:1,
      mediaType:["image"],
      sourceType:['album', 'camera'],
      success:res=>{
        const path = res.tempFiles.tempFilePath
        if(path != ''){
          wx.showToast({
            title: '上传图片成功',
            icon:'none'
          })
          that.setData({
            mypath : path
          })
        }
      }
    })
  },
  // 修改标题文本
  onTitleChange(e) {
    const title = e.detail.value
    const { body } = this.data.article
    if (title != ""){
      this.setData({
        "article.title": title,
        isArticleOK: title && body,
      })
    }
  },

  // 修改内容文本
  onBodyChange(e) {
    const body = e.detail.value
    const { title } = this.data.article
    if (body != ""){
      this.setData({
        "article.body": body,
        isArticleOK: title && body,
      });
      console.log(this.data.article);
    }
  },

  // 将清单数据提交到django
  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value);
    var formData = e.detail.value; //提取表单数据

    if (formData.title && formData.body){
      console.log("正在上传...");
      wx.showToast({
        title: '分享经验中',
        duration: 2000,
        icon: 'loading',
        mask: true
      })
      app.login(() => {
        wx.getStorage({
          key: 'access',
          success: (result) => {
            const access = result.data;
            wx.request({
              url: 'http://127.0.0.1:8000/api/article/article-create/',
              method: 'POST',
              header: {
                'Authorization': 'Bearer ' + access,
                'content-type': 'application/x-www-form-urlencoded',
              },
              data: formData, //表单数据
              success: () => {
                wx.showToast({
                  title: '分享经验成功！', //提示的内容
                  duration: 2000, //持续的时间
                  icon: 'success', //图标有success、error、loading、none四种
                  mask: true //显示透明蒙层 防止触摸穿透
                });
                this.formReset();
              }
            })
          }
        })
      })
    }
    else {
      wx.showToast({
        title: '请填写标题内容',
        duration: 2000,
        icon: 'error',
        mask: true
      })
    }
  },

  // 重置表单
  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
  }
})