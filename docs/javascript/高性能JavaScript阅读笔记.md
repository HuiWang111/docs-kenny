# 高性能JavaScript阅读笔记

### 优化页面加载速度
- 脚本放置于body底部
- 减少JavaScript文件大小并减少请求数量
- defer属性，但是有浏览器支持度的问题，不推荐使用
- 动态脚本元素
- XMLHttpRequest脚本注入，利用xhr下载脚本，再创建script标签
    ```js
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.text = xhr.responseText
    document.body.append(script)
    ```

### with语句的问题
- 新对象被推入作用域链的首位，因此访问局部变量会变慢
- 语法上令人困惑

### js中的动态作用域
- with语句
- catch语句
- eval函数

### js中数据存储方式
- 字面量
- 变量
- 数组成员
- 对象成员

### 数据存取层面性能优化
- 在函数中多次访问全局变量（甚至是嵌套全局对象），可以使用局部变量保存全局变量。
- 使用变量保存对象原型链的访问

### DOM层面性能优化
- 减少DOM的操作和访问，尽量把运算放到ECMAScript这一端完成
- 使用element.cloneNode()代替createElement，复制通常比创建更快
- 最小化重排和重绘

### DOM重排何时发生
- 添加或删除可见的DOM元素
- 元素的位置发生改变
- 元素的尺寸发生改变（外边距、内边距、边框厚度、宽度、高度等属性）
- 内容改变，例如：文本改变或者图片被另一个不用尺寸的图片替代
- 页面渲染器初始化
- 浏览器窗口尺寸改变

### 渲染树变化的队列和刷新
- 重排会产生计算消耗，浏览器通过队列化修改和批量执行来优化冲重排过程。但有些属性和方法会强制刷新队列并要求任务立即执行
    - `offsetTop`, `offsetLeft`, `offsetWidth`, `offsetHeight`
    - `scrollTop`, `scrollLeft`, `scrollWidth`, `scrollHeight`
    - `clientTop`, `clientLeft`, `clientWidth`, `clientHeight`
    - `getComputedStyle()`
- 尽量避免在修改样式过程中使用这些方法

### 减少重排方法
- 利用display: none;临时在文档中移除目标元素，操作完成之后再恢复
- 利用createDocumentFragment方法
- 利用cloneNode(true)创建节点的备份，然后对副本进行操作，操作完成之后利用replaceChild方法替换旧的节点
- 尽可能使用createDocumentFragment，因为产生的重排次数最少

### if-else与switch
- if-else适合判断两个离散值或者几个不同的值域
- 当多余两个离散值时，switch语句是更佳的选择

### 如何优化if-else
- 确保最可能出现的条件放在首位
- 使用嵌套if-else代替单个庞大的if-else，最小化判断次数

### 递归带来的问题
- 可能会超出浏览器调用栈的限制
- 调用栈溢出错误有可能被捕获，但不推荐这么做，这种错误通常不应该发布到线上

### 字符串拼接性能
- 利用数组的join()方法和+、+=性能差不多，只有在IE7及更早的版本中，join()方法由于+、+=
- String.prototype.concat在大多数情况下都比上述上中方法慢

### 正则表达式工作原理
- 编译
    - 浏览器验证你的正则表达式，并把它转换为一个原生代码程序
- 设定起始位置
- 匹配正则表达式字元
- 匹配成功活失败
    - 匹配失败会回退到第二步，并从下一个字符重新开始匹配。如果每个字符都经过这个过程还没匹配成功，则宣告匹配失败

### Web Worker运行环境
- 一个navigator对象，只包括四个属性：appName、appVersion、user Agent和platform
- 一个location对象（与window.location相同，不过所有属性都是可读的）
- 一个self对象，指向全局worker对象
- 一个importScripts()方法，用来加载worker所用到的外部js文件
- 所有ECMAScript对象，比如Object、Array、Date等
- XMLHttpRequest构造器
- setTimeout()和setInterval()方法
- 一个close方法，它能立刻停止Worker运行

### Web Work实际应用
```js
var worker = new Worker('jsonparser.js');

worker.onmessage = function(event) {
    var jsonData = event.data;
    evaluateData(jsonData);
}

worker.postMessage(jsonText);

// jsonparser.js
self.onmessage = function(event){
    var jsonText = event.data;
    var jsonData = JSON.parse(jsonText);
    self.postMessage(jsonData);
}
```

### 什么情况下适合使用Web Worker
- 编码/解码大字符串
- 复杂的数学运算（包括图像或视频处理）。
- 大数组排序
- 总结：任何超过100毫秒的处理过程，都应该考虑使用Worker是否比基于定时器的方案更为合适

### JavaScript编程实践
- 避免使用eval()或Function()构造器。同样的setTimeout和setInterval应该传递函数而不是字符串
- 尽量使用字面量创建数组和对象
- 避免重复的工作
- 进行数学计算时，考虑使用位运算
- 尽量使用原生方法

### 构建部署层面的性能优化
- 合并多个js文件
- 预处理js文件（移除只在开发环境需要代码等）
- 代码压缩
- 缓存js文件
- 使用内容分发网络（CDN）
