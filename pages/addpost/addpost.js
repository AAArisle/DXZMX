// pages/addpost/addpost.js
const app = getApp()

Page({
  // 页面的初始数据
  data: {
    article: {
      title: '',
      body: '',
    },
    isArticleOK: false,
  },

  // 修改标题文本
  onTitleChange(e) {
    const title = e.detail.value
    const { body } = this.data.article
    this.setData({
      "article.title": title,
      isArticleOK: title && body,
    })
  },

  // 修改内容文本
  onBodyChange(e) {
    const body = e.detail.value
    const { title } = this.data.article
    this.setData({
      "article.body": body,
      isArticleOK: title && body,
    })
  },

  // 将清单数据提交到django
  formSubmit() {
    if (this.data.isArticleOK){
      app.login(() => {
        wx.getStorage({
          key: 'access',
          success: (result) => {
            const access = result.data;
            wx.request({
              url: 'http://127.0.0.1:8000/api/article/article-create/',
              method: 'POST',
              header: {
                'Authorization': 'Bearer ' + access
              },
              data: {
                article: this.data.article
              }
            })
          }
        })
      })
    }
    else {
      wx.showToast({
        title: '分享经验失败！请检查标题和内容是否填写！', //提示的内容
        duration: 2000, //持续的时间
        icon: 'error', //图标有success、error、loading、none四种
        mask: true //显示透明蒙层 防止触摸穿透
      })
    }
  },
})