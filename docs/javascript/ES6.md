# ECMAScript6入门 阅读笔记

### ES6与ES2015的关系
- ES6泛指ES5.1版本后的所有版本，涵盖ES2015、ES2016、ES2017等等

### Generator函数基本概念
- 调用Generator函数，返回一个遍历器对象，代表Generator函数内部指针
- Generator函数是分段执行的，yield表达式是暂停执行的标记，而next方法可以恢复执行

### Generator函数写法
```js
// 以下都可以
function * foo() {}
function *foo() {}
function* foo() {} // 通常使用这种
function*foo() {}
```

### next方法的参数
```js
// next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值
// 第一次调用next方法传递参数是无效的
function* f() {
  for(var i = 0; true; i++) {
    var reset = yield i;
    if(reset) { i = -1; }
  }
}

var g = f();

g.next() // { value: 0, done: false }
g.next() // { value: 1, done: false }
g.next(true) // { value: 0, done: false }
```

### 使原生对象可以使用for...of循环
```js
function* objectEntries(obj) {
  let propKeys = Reflect.ownKeys(obj);

  for (let propKey of propKeys) {
    yield [propKey, obj[propKey]];
  }
}

let jane = { first: 'Jane', last: 'Doe' };

for (let [key, value] of objectEntries(jane)) {
  console.log(`${key}: ${value}`);
}
// first: Jane
// last: Doe

function* objectEntries() {
  let propKeys = Object.keys(this);

  for (let propKey of propKeys) {
    yield [propKey, this[propKey]];
  }
}

let jane = { first: 'Jane', last: 'Doe' };

jane[Symbol.iterator] = objectEntries;

for (let [key, value] of jane) {
  console.log(`${key}: ${value}`);
}
// first: Jane
// last: Doe
```

### Generator.prototype.throw()
```js
Generator 函数返回的遍历器对象，都有一个throw方法，可以在函数体外抛出错误，然后在 Generator 函数体内捕获。
// 只有遍历器对象上的throw方法抛出的异常才能在Generator函数中被捕获
// 全局throw方法抛出的异常无法在Generator函数中被捕获
// 如果 Generator 函数内部没有部署try...catch代码块，那么throw方法抛出的错误，将被外部try...catch代码块捕获
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log('内部捕获', e);
  }
};

var i = g();
i.next();

try {
  i.throw('a');
  i.throw('b');
} catch (e) {
  console.log('外部捕获', e);
}
// 内部捕获 a
// 外部捕获 b
```

### Generator.prototype.return()
```js
Generator 函数返回的遍历器对象，还有一个return()方法，可以返回给定的值，并且终结遍历 Generator 函数。
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

var g = gen();

g.next()        // { value: 1, done: false }
g.return('foo') // { value: "foo", done: true }
g.next()        // { value: undefined, done: true }
```

### Generator函数的this
- 不能当做构造函数和new一起使用，会报错
- Generator函数返回的遍历器对象，是Generator函数的实例，而且会继承Generator函数的prototype
- Generator函数中对this的赋值不会对在返回的遍历器对象上体现

### Generator函数上下文
- Generator 函数执行产生的上下文环境，一旦遇到yield命令，就会暂时退出堆栈，但是并不消失，里面的所有变量和对象会冻结在当前状态。等到对它执行next命令时，这个上下文环境又会重新加入调用栈，冻结的变量和对象恢复执行。

### 参数求值策略
- 传值调用：先计算，再将计算结果传入到函数
- 传名调用：将表达式传入到函数中，真正用到的时候再进行求值

### Thunk函数的含义
```js
// Thunk直译为形实转换程序
function f(m) {
  return m * 2;
}

f(x + 5);

// 等同于

var thunk = function () {
  return x + 5;
};

function f(thunk) {
  return thunk() * 2;
}
```

### JS中的Thunk函数
- js中的thunk函数是指将多参数函数转换为但参数函数
    ```js
    // 正常版本的readFile（多参数版本）
    fs.readFile(fileName, callback);

    // Thunk版本的readFile（单参数版本）
    var Thunk = function (fileName) {
    return function (callback) {
        return fs.readFile(fileName, callback);
    };
    };

    var readFileThunk = Thunk(fileName);
    readFileThunk(callback);
    ```

### Thunk函数的自动管理流程
```js
function run(fn) {
  var gen = fn();

  function next(err, data) {
    var result = gen.next(data);
    if (result.done) return;
    result.value(next);
  }

  next();
}

function* g() {
  // ...
}

run(g);
```

### 基于Promise对象的自动执行
```js
function run(gen){
  var g = gen();

  function next(data){
    var result = g.next(data);
    if (result.done) return result.value;
    result.value.then(function(data){
      next(data);
    });
  }

  next();
}

run(gen);
```

### async函数对Generator函数的改进
- 内置执行器
    - 自动执行，与执行普通函数无异
- 更好的语义
- 更广的实用性
    - await后可以是Promise对象和原始值（会立即转换为resolved的Promise对象）
- 返回Promise对象

### ES6模块与CommonJS模块的差异
- CommonJS模块输出一个值的拷贝，ES6模块输入的是值的引用
- CommonJS模块是运行时加载，ES6模块是编译时输出接口
- CommonJS模块的require()是同步加载模块，ES6模块的import命令是异步加载模块，有一个独立的模块依赖的解析阶段

### 装饰器（Decorator）
- 装饰器是一种函数，它可以放在类和类属性的定义前面
- 装饰器对类的行为的改变，是发生在编译时，装饰器本质就是编译时执行的函数

### 装饰器装饰类的属性
```js
function readonly(target, name, descriptor){
  // descriptor对象原来的值如下
  // {
  //   value: specifiedFunction,
  //   enumerable: false,
  //   configurable: true,
  //   writable: true
  // };
  descriptor.writable = false;
  return descriptor;
}

readonly(Person.prototype, 'name', descriptor);
// 类似于
Object.defineProperty(Person.prototype, 'name', descriptor);
```
