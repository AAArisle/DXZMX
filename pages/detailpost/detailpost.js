// pages/detailpost/detailpost.js
const app = getApp()

Page({
  data: {
    top: false,
    topIcon: "../../images/top.png",
    marked: false,
    markIcon:"../../images/s.png",
    showInput: false,
    like: 0,
    likeIcon:"../../images/dz.png",
    hateIcon:"../../images/dz.png",
    userInfo:{},
    school_logo: "../../images/大学/暨南大学.png",
    school_name: "暨南大学",
    article: [{
      avatar_url: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
      fields:{
        author: "作者",
        title: "标题",
        updated: "2024-5-29",
        body: "...",
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
    this.updateStarLike()
  },
  onClickComment(){
    this.setData({showInput: !this.data.showInput})
  },
  onClickLike(){
    const statue = this.data.like!=1?1:0
    this.setData({
      like: statue,
      likeIcon: statue==0?"../../images/dz.png":"../../images/dz2.png",
      hateIcon: "../../images/dz.png",
    })
    this.updateStarLike()
  },
  onClickHate(){
    const statue = this.data.like!=-1?-1:0
    this.setData({
      like: statue,
      likeIcon: "../../images/dz.png",
      hateIcon: statue==0?"../../images/dz.png":"../../images/dz2.png",
    })
    this.updateStarLike()
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
    let that = this;
    wx.showModal({
      content:"确认删除评论？",
      success(res){
        if(res.confirm) that.deleteComment(e.target.id)
      },
    });
  },
  deleteComment(id){
    this.data.comments.splice(id, 1)
    this.setData({
      comments: this.data.comments,
    })
  },
  onClickDeleteArticle(){
    let that = this;
    wx.showModal({
      content:"确认删除经验？",
      success(res){
        if(res.confirm) that.deleteArticle()
      },
    });
  },
  deleteArticle(){
    app.login(() => {
      // 用token获取用户数据
      console.log('login：从django获得data中')
      wx.getStorage({
        key: 'access',
        success: (result) => {
          const access = result.data;
          console.log('login：token获得成功');
          console.log(access);
          wx.request({
            url: 'http://127.0.0.1:8000/api/article/article-delete/'+this.data.id+'/',
            header: {
              // 注意字符串 'Bearer ' 尾部有个空格！
              'Authorization': 'Bearer ' + access
            },
            success: () => {
              wx.showToast({
                title: '删除经验成功！',
                icon: 'success',
              });
              // 延迟一秒后跳转回原页面
              setTimeout(function(){wx.navigateBack({})}, 1000)
            }
          })
        }
      })
    })
  },

  tapToEdit() {
    wx.navigateTo({
      url: '../updatepost/updatepost?id='+this.data.id,
    })
  },

  updateStarLike() {
    app.login(() => {
      // 用token获取用户数据
      wx.getStorage({
        key: 'access',
        success: (result) => {
          const access = result.data;
          console.log('detailpost：token获得成功');
          wx.request({
            url: 'http://127.0.0.1:8000/api/weixin/about/',
            header: {
              'Authorization': 'Bearer ' + access
            },
            method: 'POST',
            data: {
              id: this.data.id,
              like: this.data.like,
              star: this.data.marked
            },
            success: res => {
              let article = JSON.parse(res.data.article)
              this.setData({
                "article[0].fields.likes": article[0].fields.likes,
                "article[0].fields.hates": article[0].fields.hates,
              })
            }
          })
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({id:options.id})
    app.login(() => {
      // 用token获取用户数据
      wx.getStorage({
        key: 'access',
        success: (result) => {
          const access = result.data;
          console.log('detailpost：token获得成功');
          //获取当前用户信息
          wx.request({
            url: 'http://127.0.0.1:8000/api/weixin/data/',
            header: {
              'Authorization': 'Bearer ' + access
            },
            success: res => {
              const url = res.data.avatar_url.slice(8,13) == 'mmbiz' ? defaultAvatarUrl : res.data.avatar_url
              this.setData({
                "userInfo.avatarUrl": url,
                "userInfo.nickName": res.data.nickname,
              })
            }
          })
          //获取经验详情
          wx.request({
            url: 'http://127.0.0.1:8000/api/article/article-detail/'+this.data.id+'/',
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
                article: article
              })
            }
          })
          // 收藏和点赞
          wx.request({
            url: 'http://127.0.0.1:8000/api/weixin/about/',
            header: {
              'Authorization': 'Bearer ' + access
            },
            method: 'POST',
            data: {
              id: this.data.id
            },
            success: res => {
              console.log(res);
              this.setData({
                like: res.data.like,
                marked: res.data.star
              })
              if (this.data.like == 1) {
                this.setData({
                  likeIcon: "../../images/dz2.png"
                })
              }
              else if (this.data.like == -1) {
                this.setData({
                  hateIcon: "../../images/dz2.png"
                })
              }
              if (this.data.marked){
                this.setData({
                  markIcon: "../../images/s2.png",
                })
              }
            }
          })
        }
      });
    })
  },
})