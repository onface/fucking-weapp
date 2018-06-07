Page({
  data: {
      array: ['美国', '中国', '巴西', '日本'],
      value: "中国"
  },
  bindPickerChange: function (e) {
      this.setData({
          value: this.data.array[e.detail.value]
      })
  },
  bindChangeArray: function () {
      this.setData({
          array: ["fucking-wechat"].concat(this.data.array)
      })
  }
})
