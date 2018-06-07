Page({
  data: {
      array: ['美国', '中国', '巴西', '日本'],
      index: 1 // 默认显示中国
  },
  bindPickerChange: function (e) {
      this.setData({
          index: e.detail.value
      })
  },
  bindChangeArray: function () {
      this.setData({
          array: ["fucking-wechat"].concat(this.data.array)
      })
  }
})
