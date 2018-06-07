# fucking-weapp

操蛋的🖕微信小程序🖕

> 本项目列出微信小程序操蛋的地方，供大家品尝。

## 目录

- [requestAnimationFrame](#requestanimationframe)

## requestAnimationFrame

模拟器支持 `requestAnimationFrame`，真机不支持。

解决方法：在调用 `requestAnimationFrame` 代码之前加上 

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

[表情包](https://github.com/onface/fucking-weapp/issues/1#issue-330167725)

**要不就模拟器也不支持，模拟器支持，真机不支持。那要模拟器干什么呢？**
