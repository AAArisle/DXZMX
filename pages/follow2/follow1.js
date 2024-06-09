const app = getApp()

Page({
  data: {
    school:["大学1","大学2","大学3"],
    major:["专业1","专业2","专业3"],
    course:["课程1","课程2","课程3"],
    schoolFollows: [0,1],
    majorFollows: [1],
    courseFollows: [2],
  },

  removeSchoolFollow(e) {
    let list = this.data.schoolFollows;
    let item = e.currentTarget.dataset.item;
    list.splice(list.indexOf(item), 1)
    this.setData({
      schoolFollows: list,
    })
    this.uploadFollowData()
    wx.showToast({
      title: '取消关注'+this.data.school[item],
      icon: 'success',
    });
  },
  removeMajorFollow(e) {
    let list = this.data.majorFollows;
    let item = e.currentTarget.dataset.item;
    list.splice(list.indexOf(item), 1)
    this.setData({
      majorFollows: list,
    })
    this.uploadFollowData()
    wx.showToast({
      title: '取消关注'+this.data.major[item],
      icon: 'success',
    });
  },
  removeCourseFollow(e) {
    let list = this.data.courseFollows;
    let item = e.currentTarget.dataset.item;
    list.splice(list.indexOf(item), 1)
    this.setData({
      courseFollows: list,
    })
    this.uploadFollowData()
    wx.showToast({
      title: '取消关注'+this.data.course[item],
      icon: 'success',
    });
  },

  addSchoolFollow(e) {
    let list = this.data.schoolFollows;
    let item = e.currentTarget.dataset.item;
    list.push(item)
    list.sort()
    this.setData({
      schoolFollows: list,
    })
    this.uploadFollowData()
    wx.showToast({
      title: '关注'+this.data.school[item]+'成功',
      icon: 'success',
    });
  },
  addMajorFollow(e) {
    let list = this.data.majorFollows;
    let item = e.currentTarget.dataset.item;
    list.push(item)
    list.sort()
    this.setData({
      majorFollows: list,
    })
    this.uploadFollowData()
    wx.showToast({
      title: '关注'+this.data.major[item]+'成功',
      icon: 'success',
    });
  },
  addCourseFollow(e) {
    let list = this.data.courseFollows;
    let item = e.currentTarget.dataset.item;
    list.push(item)
    list.sort()
    this.setData({
      courseFollows: list,
    })
    this.uploadFollowData()
    wx.showToast({
      title: '关注'+this.data.course[item]+'成功',
      icon: 'success',
    });
  },

  uploadFollowData() {
    app.login(() => {
      // 用token获取用户数据
      wx.getStorage({
        key: 'access',
        success: (result) => {
          const access = result.data;
          console.log('index：token获得成功');
          wx.request({
            url: 'http://127.0.0.1:8000/api/weixin/tag/',
            method: 'POST',
            data: {
              change: true,
              schoolFollows: this.data.schoolFollows,
              majorFollows: this.data.majorFollows,
              courseFollows: this.data.courseFollows
            },
            header: {
              // 注意字符串 'Bearer ' 尾部有个空格！
              'Authorization': 'Bearer ' + access
            },
          })
        }
      });
    })
  },

  onLoad() {
    app.login(() => {
      // 用token获取用户数据
      wx.getStorage({
        key: 'access',
        success: (result) => {
          const access = result.data;
          console.log('index：token获得成功');
          wx.request({
            url: 'http://127.0.0.1:8000/api/weixin/tag/',
            method: 'POST',
            data: {
              change: false,
            },
            header: {
              // 注意字符串 'Bearer ' 尾部有个空格！
              'Authorization': 'Bearer ' + access
            },
            success: res => {
              // 在小程序调试器中查看返回值是否正确
              console.log(res.data)
              this.setData({
                schoolFollows: res.data.schoolFollows,
                majorFollows: res.data.majorFollows,
                courseFollows: res.data.courseFollows
              })
            }
          })
        }
      });
    })
  },

  toggleFollow(event) {
    const index = event.currentTarget.dataset.index;
    const allFollows = this.data.allFollows;
    allFollows[index].followed = !allFollows[index].followed;
    this.setData({ allFollows });
  }
});