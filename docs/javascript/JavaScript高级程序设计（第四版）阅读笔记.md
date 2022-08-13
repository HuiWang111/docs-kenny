# JavaScript高级程序设计（第四版）阅读笔记

### script标签的属性
- `async` 可选。表示脚本应该立即下载，但不能阻塞其他页面的动作
- `charset` 可选。使用src属性指定的代码字符集
- `crossorigin` 可选。配置相关请求的CORS（跨域资源共享）设置。默认不适用CORS。
    - `anonymous` 配置文件请求不必设置凭据标志。
    - `use-credentials` 设置凭据标志，意味着出站请求会包含凭据
- `defer` 可选。表示脚本立即下载但可以延迟到文档完全被解析和显示之后再执行。只对外部脚本有效。
- `integrity` 可选。允许比对接收到的资源和指定的加密签名以验证资源的完整性。如果接收到的资源的签名与这个属性指定的签名不匹配，则页面会报错，脚本不会被执行。这个属性可以确保CDN不会提供恶意内容。
- `language` 废弃。最初用于表示代码块中的脚本语言（`JavaScript`、`JavaScript1.2`、`VBScript`）
- `src` 可选。表示包含要执行代码的外部文件。
- `type` 可选。代替 `language`，表示代码块中脚本语言的内容类型（也称MIME类型）
    - text/javascript（废弃）
    - text/ecmascript（废弃）
    - application/x-javascript（非IE）
    - application/javascript（非IE）
    - application/ecmascript
    - module
- `async` 和 `deffer` 的区别主要是async不能保证脚本的顺序

### 推荐使用外部js的原因
- 可维护性
- 缓存
- 适应未来

### var与let的区别
- var会变量提升；let在声明之前变量处于“暂时性死区”，访问该变量会导致ReferenceError
- var声明的全局变量会成window对象的属性，而let不会
- let声明有块级作用域；var没有
- 重复的var声明会被忽略，而重复的let声明会报错（SyntaxError）
- 严格来说let声明也会被提升，但是由于“暂时性死区”的缘故，实际上不能在声明之前使用let变量

### typeof结果
- `undefined`
- `boolean`
- `string`
- `number`
- `object`
- `function`
- `symbol`

### 为什么tpyeof null是 `object`
- null表示一个空指针

### 模板字面量标签函数
```js
let a = 6;
let b = 9;

function simpleTag(strings, ...expressions) {
    console.log(strings)
    for (const expression of expressions) {
        console.log(expression)
    }
    
    return 'foobar'
}

let untaggedResult = `${a} + ${b} = ${a + b}`;
let tagedResult = simpleTag`${a} + ${b} = ${a + b}`;
// ['', ' + ', ' = ', '']
// 6
// 9
// 15
```

### 原始字符串
```js
console.log(`\u00A9`) // ©
console.log(String.raw`\u00A9`) // \u00A9

console.log(`first line\nsecond line`)
// first line
// second line
console.log(String.raw`first line\nsecond line`) // first line\nsecond line

console.log(`first line
second line`)
// first line
// second line
console.log(String.raw`first line
second line`)
// first line
// second line
```

### 负数的二进制
- 确定绝对值的二进制表示
- 找到数值的补数（反码）。即0变成1，1变成0
    - 给结果加1
- 按位非
```js
let num1 = 25; //    00000000000000000000000000011001
let num2 = ~num1; // 11111111111111111111111111100110
```

### 按位与
- 两位都是1时返回1，任何一位是0则返回0

### 按位非
- 任何一位是1时返回1，两位都是0时返回0

### 按位左移
```js
// 左移会保留操作数值的符号。比如-2左移5位是-64
let oldValue = 2; // 10
let newValue = oldValue << 5; // 100 0000
```

### 有符号右移
```js
let oldValue = 64; // 100 0000
let newValue = oldValue >> 5; // 10
```

### 无符号右移
- `>>>`
- 对于正数无符号右移与有符号右移结果相同
- 在对-64 无符号右移 5 位后，结果是 134 217 726。这是因为-64 的二进制表示是 11111111111111111111111111000000，无符号右移却将它当成正值，也就是 4 294 967 232。把这个值右移 5 位后，结果是00000111111111111111111111111110，即 134 217 726。

### 垃圾回收方式
- 标记清理
    - 进入上下文时加上存在上下文的标记
    - 离开上下文时加上离开上下文的标记
    - 维护“在上下文中”和“不在上下文中”两个变量列表
- 引用计数
    - 其思路是对每个值都记录它被引用的次数。声明变量并给它赋一个引用值时，这个值的引用数为 1。如果同一个值又被赋给另一个变量，那么引用数加 1。类似地，如果保存对该值引用的变量被其他值给覆盖了，那么引用数减 1。当一 个值的引用数为 0 时，就说明没办法再访问到这个值了，因此可以安全地收回其内存了
    - 问题
        - 循环引用导致引用计数永远不会为0，因此不会被回收。可以通过赋值为null切断变量与之前引用值之间的关系

### 主动触发垃圾回收
- IE：window.CollectGarbage()
- Opera7及更高版本中：window.opera.collect()

### 隐藏类
-  同一个类创建出来的多个实例会共享一个隐藏类
- 以下操作会使同一个类创建出的多个实例对应不同的隐藏类
    - 对某个实例添加属性
    - 对某个实例删除属性（解决方法是可以把需要删除的属性置为null）

### Date
- Date.parse()
    - 接受一个表示日期的字符串参数，并尝试转换为表示该日期的毫秒数
    - 字符串格式
        - “月/日/年”，如"5/23/2019"； 
        - “月名 日, 年”，如"May 23, 2019"； 
        - “周几 月名 日 年 时:分:秒 时区”，如"Tue May 23 2019 00:00:00 GMT-0700"； 
        - ISO 8601 扩展格式“YYYY-MM-DDTHH:mm:ss.sssZ”，如 2019-05-23T00:00:00（只适用于兼容 ES5 的实现）。
    - 传递的字符串参数不表示日期，则返回NaN
- Date.UTC()

### RegExp
- 匹配模式的标记
    - g：全局模式，表示查找字符串的全部内容，而不是找到第一个匹配的内容就结束。 
    - i：不区分大小写，表示在查找匹配时忽略 pattern 和字符串的大小写。 
    - m：多行模式，表示查找到一行文本末尾时会继续查找。 
    - y：粘附模式，表示只查找从 lastIndex 开始及之后的字符串。 
    - u：Unicode 模式，启用 Unicode 匹配。 
    - s：dotAll 模式，表示元字符.匹配任何字符（包括\n 或\r）。

### encodeURI与encodeURIComponent
```js
let uri = "http://www.wrox.com/illegal value.js#start"; 
// 'http://www.wrox.com/illegal%20value.js#start'
console.log(encodeURI(uri));

// 'http%3A%2F%2Fwww.wrox.com%2Fillegal%20value.js%23start'
console.log(encodeURIComponent(uri));
```

### Map与Object区别
- 内存占用
    - 但给定固定大小的内存，Map 大约可以比 Object 多存储 50%的键/值对
- 插入性能
    - Map性能更佳
- 查找速度
    - 如果代码涉及大量查找操作，那么某些情况下可能选择 Object 更好一些。 
- 删除性能
    - 如果代码涉及大量删除操作，那么毫无疑问应该选择 Map

### 原型链的问题
- 原型链的引用属性会在每个父类实例和子类实例上共享
- 子类实例化时不能给父类传参

### ES6类的实例化
- 在内存中创建一个对象
- 这个新对象内部的[[Prototype]]指针被赋值为构造函数的prototype属性
- 构造函数内部的this被赋值为这个新对象（即this指向新对象）
- 执行构造函数内部的代码（给新对象添加属性）
- 如果构造函数返回非空对象，则返回该对象；否则返回新对象

### 抽象类实现
```js
class Vehicle { 
    constructor() {
        if (new.target === Vehicle) { 
            throw new Error('Vehicle cannot be directly instantiated');
        }
        
        // 要求子类必须拥有foo属性
        if (!this.foo) { 
            throw new Error('Inheriting class must define foo()'); 
        } 
    } 
} 
```
