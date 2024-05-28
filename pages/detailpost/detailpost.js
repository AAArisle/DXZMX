// pages/detailpost/detailpost.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  /*data: {
    article: []
  },*/

  data: {
    top: false,
    topIcon: "../../images/top.png",
    marked: false,
    markIcon:"../../images/s.png",
    showInput: false,
    liked: false,
    likeIcon:"../../images/dz.png",
    popUp: {
      show: false,
      text: "",
      confirm: "",
      id: 0,
    },
    
    school_logo: "../../images/大学/暨南大学.png",
    school_name: "暨南大学",
    article: [{
      avatar_url: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
      fields:{
        author: "作者",
        title: "标题",
        updated: "2024-5-29",
        body: "内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容内容",
        image: "../../images/tx.png",
        likes: 3,
        commentAmount: 2,
        total_views: 1
      }
    }],
    comments: [{
      id: 0,
      like: 0,
      likeIcon:"../../images/dz.png",
      hateIcon:"../../images/dz.png",
      userInfo: {
        avatarUrl: "../../images/tx.png",
        nickName: 'Han Sole',
      },
      fields:{
        date: "几秒前",
        body: "We aupply a series of design principles,practical patterns and high quailty design resources (Sketch and Axure)",
        likeAmount: 2,
        hateAmount: 0,
      }
    },
    {
      id: 1,
      like: 0,
      likeIcon:"../../images/dz.png",
      hateIcon:"../../images/dz.png",
      userInfo: {
        avatarUrl: "../../images/tx.png",
        nickName: 'Han Sole',
      },
      fields:{
        date: "一天前",
        body: "We aupply a series of design principles,practical patterns and high quailty design resources (Sketch and Axure)",
        likeAmount: 1,
        hateAmount: 0,
      }
    }
  ]
  },

  onClickTop(){
    this.setData({
      top: !this.data.top,
      topIcon: this.data.top?"../../images/top.png":"../../images/top2.png",
    })
  },
  onClickMark(){
    this.setData({
      marked: !this.data.marked,
      markIcon: this.data.marked?"../../images/s.png":"../../images/s2.png",
    })
  },
  onClickComment(){
    this.setData({showInput: !this.data.showInput})
  },
  onClickLike(){
    this.setData({
      liked: !this.data.liked,
      likeIcon: this.data.liked?"../../images/dz.png":"../../images/dz2.png",
    })
  },
  onInput(e){
    
  },
  onClickLikeComment(e){
    var list = this.data.comments;
    list[e.target.id].like = list[e.target.id].like!=1?1:0
    list[e.target.id].likeIcon = list[e.target.id].like==0?"../../images/dz.png":"../../images/dz2.png"
    list[e.target.id].hateIcon = "../../images/dz.png"
    this.setData({
      comments: list,
    })
  },
  onClickHateComment(e){
    var list = this.data.comments;
    list[e.target.id].like = list[e.target.id].like!=-1?-1:0
    list[e.target.id].likeIcon = "../../images/dz.png"
    list[e.target.id].hateIcon = list[e.target.id].like==0?"../../images/dz.png":"../../images/dz2.png"
    this.setData({
      comments: list,
    })
  },
  onClickDeleteComment(e){
    this.setData({
      popUp: {
        show: true,
        text: "确认删除评论？",
        confirm: "deleteComment",
        id: e.target.id,
      }      
    })
  },
  deleteComment(e){
    this.data.comments.splice(this.data.popUp.id, 1)
    this.setData({
      comments: this.data.comments,
    })
  },
  onClickDeleteArticle(){
    this.setData({
      popUp: {
        show: true,
        text: "确认删除文章？",
        confirm: "deleteArticle"
      }      
    })
  },
  deleteArticle(){
    wx.switchTab({
      url: '../index/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let id = options.id
    app.login(() => {
      // 用token获取用户数据
      wx.getStorage({
        key: 'access',
        success: (result) => {
          const access = result.data;
          console.log('detailpost：token获得成功');
          wx.request({
            url: 'http://127.0.0.1:8000/api/article/article-detail/'+id+'/',
            method: 'GET',
            header: {
              // 注意字符串 'Bearer ' 尾部有个空格！
              'Authorization': 'Bearer ' + access
            },
            success: res => {
              // 在小程序调试器中查看返回值是否正确
              let article = JSON.parse(res.data.article)
<<<<<<< HEAD
              article[0].avatar_url = 'http://127.0.0.1:8000/media/'+article[0].avatar_url
              article[0].fields.image = 'http://127.0.0.1:8000/media/'+article[0].fields.image
              console.log(article[0].fields)
=======
              console.log(article)
              article[0].avatar_url = 'http://127.0.0.1:8000/media/'+article[0].avatar_url;
>>>>>>> 757105cdf11d47cef3617ef81ed7dfdbdb8d0c47
              this.setData({
                article: article
              })
            }
          })
        }
      });
    })
  },
})