# fucking-weapp

操蛋的🖕微信小程序🖕

> 本项目列出微信小程序操蛋的地方，供大家品尝。

## 目录

- [requestAnimationFrame](#requestanimationframe)
- [picker](#picker)
- [background-image](#background-image)

## requestAnimationFrame

模拟器支持 `requestAnimationFrame`，真机不支持。

### 解决方法

在调用 `requestAnimationFrame` 代码之前加上

```js
if (typeof wx !== 'undefined' && wx.request !== 'undefined') {
    var lastTime = 0;
    var requestAnimationFrame = function(callback) {
        var now = new Date().getTime()
        var nextTime = Math.max(lastTime + 16, now)
        return setTimeout(function() { callback(lastTime = nextTime)}, nextTime - now);
    };
    var cancelAnimationFrame = clearTimeout;
}
```

1. 每个使用 `requestAnimationFrame` 的地方都要加上这段代码
2. 不加的话会报错
3. 那你加到全局变量啊
4. 有手有脚的
5. 全局变量是不可能加的
6. 这辈子都不可能加的
7. 小程序支持全局变量又不会支持
8. 就只能每个地方都写这种东西
9. 才可以维持得了生活这样子

[表情包:大图预警](https://github.com/onface/fucking-weapp/issues/1#issue-330167725)

**要不就模拟器也不支持，模拟器支持，真机不支持。那要模拟器干什么呢？**

## picker

`<picker bindchange="bindPickerChange" >` 中 `bindchange` 的回调函数传参是**索引值**



```html
<view>
  <picker bindchange="bindPickerChange" value="{{index}}" range="{{array}}">
    <button>
      当前选择：{{array[index]}} : {{index}}
    </button>
  </picker>
  <button bindtap="bindChangeArray" >修改 array</button>
</view>

```

```js
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
```

当 `array` 变动后， `index` 如果依然指向的是 `1` 就会显示错误。

### 解决方法

在数据中保存 `value` 形式的值而不是索引，通过 `wxs` 将 `value` 转换为索引。回调函数中讲索引转换为 `value`。

```js
// index.js
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
```

```html
<wxs src="./valueToIndex.wxs" module="valueToIndex" />
<view>
  <picker bindchange="bindPickerChange" value="{{valueToIndex(array, value)}}" range="{{array}}">
    <button>
      当前选择：{{array[valueToIndex(array, value)]}}  value: {{value}} index:{{valueToIndex(array, value)}}
    </button>
  </picker>
  <button bindtap="bindChangeArray" >修改 array</button>
</view>
```

```js
// valueToIndex.wxs
module.exports = function (data, value) {
    var index = data.indexOf(value)
    if (index === -1) {
        return ''
    }
    else {
        return index
    }
}
```

如果小程序能更新接口

```js
<picker data="{{array}}" id="{{value}}" bindchangeid="bindPickerChange" />
{
    data: {
        array: [
            {
                id: 'a',
                name: '中国'
            },
            {
                id: 'b',
                name: 'better weapp'
            }
        ],
        value: "b"
    },
    bindPickerChange: function (e) {
        this.setData({
            value: e.detail.value // e.detail.value is "a" or "b"
        })
    }
}
```

这样既能兼容老接口支持已经上线的 `value` `bindchange` 又能让接口更友好。

但是请看[表情包:大图预警](https://github.com/onface/fucking-weapp/issues/1#issuecomment-395348717)

## background-image

> 本地资源图片无法通过 WXSS 获取，可以使用网络图片，或者 base64，或者使用<image/>标签。请参考文档
  [本地资源无法通过 wxss 获取](https://developers.weixin.qq.com/miniprogram/dev/qa.html#本地资源无法通过-wxss-获取)



```html
<view class="bg-offline" ></view>
<view class="bg-online"></view>
```

```css
.bg-offline {
    width: 100rpx;
    height:100rpx;
    border:1px solid blue;
    background:url("./onface.png"); /* 此行代码会导致 报错本地资源图片无法通过 WXSS 获取 */
}
.bg-online {
    width: 100rpx;
    height:100rpx;
    border:1px solid orange;
    background:url("https://avatars1.githubusercontent.com/u/20395258?s=200&v=4");
}

```

### 伪解决方法

**不要使用这种方式**

通过行内样式实现 `style="background-image:url('./onface.png');"`

```html
<view class="bg-inline" style="background-image:url('./onface.png');"></view>
```

```css
.bg-inline {
    width: 100rpx;
    height:100rpx;
    border:1px solid black;
}
```

模拟器可以的，但是真机不行，所以不要使用这种方式。

> 又出现了模拟器可以真机不行的情况。就问你惊不惊喜，意不意外？

### 吐槽

`<image />` 无论是远程图片还是本地图片都可以获取，`wxss` 却不能，你这不是作吗？

猜测本意是让非内容的图片资源通过网络加载，内容的图片资源打包在小程序里。这样能让用户打开小程序更快。但是你就不能编译的时候匹配 `background` 加载的本地图片，全部改为微信在线地址吗？难道是怕这点静态资源把腾讯云拖垮？

所以呢。还是老老实实用网络图片吧。

[表情包:大图预警](https://github.com/onface/fucking-weapp/issues/1#issuecomment-395367477)
