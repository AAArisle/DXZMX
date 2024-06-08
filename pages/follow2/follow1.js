Page({
  data: {
    myFollows: ['专业1', '专业2'],
    allFollows: [
      { name: '专业1', followed: true },
      { name: '专业2', followed: true },
      { name: '专业3', followed: false }
    ]
  },

  onLoad() {
    // 页面加载时执行的逻辑
  },

  searchMyFollows(event) {
    const keyword = event.detail.value;
    // 实现搜索逻辑
  },

  searchAllFollows(event) {
    const keyword = event.detail.value;
    // 实现搜索逻辑
  },

  toggleFollow(event) {
    const index = event.currentTarget.dataset.index;
    const allFollows = this.data.allFollows;
    allFollows[index].followed = !allFollows[index].followed;
    this.setData({ allFollows });
  }
});