// pages/addpost/addpost.js
const app = getApp()

Page({
  // 页面的初始数据
  data: {
    article: {
      title:'',
      body:'',
      mypath: '../../images/upload.png',
      school:'-1',
      major:'-1',
      course:'-1'
    },
    school:["大学1","大学2","大学3"],
    schooldata:'请选择',
    zhuanye:["专业1","专业2","专业3"],
    zhuanyedata:'请选择',
    class:["课程1","课程2","课程3"],
    classdata:'请选择',
    pickerDefault: -1
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
    wx.chooseMedia({
      count:1,
      mediaType:["image"],
      sourceType:['album', 'camera'],
      success:res=>{
        const path = res.tempFiles[0].tempFilePath;
        console.log(path);
        if(path != ''){
          wx.showToast({
            title: '添加图片成功',
            icon:'success'
          })
          this.setData({
            "article.mypath" : path
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
        icon: 'loading',
      })
      app.login(() => {
        wx.getStorage({
          key: 'access',
          success: (result) => {
            const access = result.data;
            if (this.data.article.mypath != '../../images/upload.png') {
              // 如果有图片
              wx.uploadFile({
                filePath: this.data.article.mypath,
                name: 'image',
                url: 'http://127.0.0.1:8000/api/article/article-update/'+this.data.id+'/',
                header: {
                  'Authorization': 'Bearer ' + access,
                  'content-type': 'application/x-www-form-urlencoded',
                },
                success: () => {
                  wx.showToast({
                    title: '更新经验成功！',
                    icon: 'success',
                  });
                }
              })
            }
            wx.request({
              url: 'http://127.0.0.1:8000/api/article/article-update/'+this.data.id+'/',
              method: 'POST',
              header: {
                'Authorization': 'Bearer ' + access,
                'content-type': 'application/x-www-form-urlencoded',
              },
              data: formData, //表单数据
              success: () => {
                wx.showToast({
                  title: '更新经验成功！',
                  icon: 'success',
                });
                // 延迟一秒后跳转回原页面
                setTimeout(function(){wx.navigateBack({})}, 1000)
              }
            })
          }
        })
      })
    }
    else {
      wx.showToast({
        title: '请填写标题正文',
        duration: 2000,
        icon: 'error',
        mask: true
      })
    }
  },

  // 重置表单
  formReset() {
    console.log('form发生了reset事件')
    this.setData({
      "article.title": '',
      "article.body": '',
      "article.mypath": '../../images/upload.png',
      schooldata:'请选择',
      zhuanyedata:'请选择',
      classdata:'请选择',
      pickerDefault: -1
    })
  },

  onLoad(options) {
    this.setData({id:options.id})
    app.login(() => {
      // 用token获取用户数据
      wx.getStorage({
        key: 'access',
        success: (result) => {
          const access = result.data;
          console.log('detailpost：token获得成功');
          wx.request({
            url: 'http://127.0.0.1:8000/api/article/article-update/'+this.data.id+'/',
            method: 'GET',
            header: {
              // 注意字符串 'Bearer ' 尾部有个空格！
              'Authorization': 'Bearer ' + access
            },
            success: res => {
              // 在小程序调试器中查看返回值是否正确
              let article = JSON.parse(res.data.article)
              console.log(article[0].fields)
              this.setData({
                "article.title":article[0].fields.title,
                "article.body":article[0].fields.body,
                "article.school":article[0].fields.school,
                "article.major":article[0].fields.major,
                "article.course":article[0].fields.course,
              })
              if (article[0].fields.image != "http://127.0.0.1:8000/media/") {
                this.setData({
                  "article.mypath":article[0].fields.image,
                })
              }
              if (this.data.article.school != -1) {
                this.setData({
                  schooldata: this.data.school[this.data.article.school]
                })
              }
              if (this.data.article.major != -1) {
                this.setData({
                  zhuanyedata: this.data.zhuanye[this.data.article.major]
                })
              }
              if (this.data.article.course != -1) {
                this.setData({
                  classdata: this.data.class[this.data.article.course]
                })
              }
            }
          })
        }
      });
    })
  },
})