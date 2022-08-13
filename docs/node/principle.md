# NodeJS原理

### 模块加载机制
- 通常会经历三个阶段
    - 路径分析
    - 文件定位
    - 编译执行
- 按照模块的分类，按照以下顺序进行优先加载：
    - **系统缓存**：模块被执行之后会会进行缓存，首先是先进行缓存加载，判断缓存中是否有值。
    - **系统模块**：也就是原生模块，这个优先级仅次于缓存加载，部分核心模块已经被编译成二进制，省略了 路径分析、文件定位，直接加载到了内存中，系统模块定义在 Node.js 源码的 lib 目录下，可以去查看。
    - **文件模块**：优先加载 .、..、/ 开头的，如果文件没有加上扩展名，会依次按照 .js、.json、.node 进行扩展名补足尝试，那么在尝试的过程中也是以同步阻塞模式来判断文件是否存在，从性能优化的角度来看待，.json、.node最好还是加上文件的扩展名。
    - **目录作为模块**：这种情况发生在文件模块加载过程中，也没有找到，但是发现是一个目录的情况，这个时候会将这个目录当作一个 包 来处理，Node 这块采用了 Commonjs 规范，先会在项目根目录查找 package.json 文件，取出文件中定义的 main 属性 ("main": "lib/hello.js") 描述的入口文件进行加载，也没加载到，则会抛出默认错误: Error: Cannot find module 'lib/hello.js'
    - **node_modules目录加载**：对于系统模块、路径文件模块都找不到，Node.js 会从当前模块的父目录进行查找，直到系统的根目录

### 文章
- [结合源码分析 Node.js 模块加载与运行原理](https://zhuanlan.zhihu.com/p/35238127)

### 什么是进程
- 进程是操作系统分配资源的最小单位
- 进程是应用程序的执行副本
- 启动应用程序：应用程序（磁盘）-> 进程（内存）

### Node.js的进程
Node.js的进程也是进程，进程下可以有很多线程。进程是Node引擎的执行副本，是操作系统分配资源的最小单位。

- Node.js进程也有主线程
- Node.js进程可以使用多线程（只不过不允许用户使用）

### 线程
- 进程是分配资源的，线程是执行程序的。
- **为什么不既分配资源，也执行程序，统一线程和进程？**
    - 进程需要的资源多，线程需要的资源少。线程只需要执行程序相关的资源：
        - 程序计数器（执行到哪一行）
        - 栈（存储执行程序的中间结果）
        - 寄存器（辅助计算以及控制）

### Node.js是单线程吗？
- Node.js进程不是单线程，内部有很多线程。用户写的Node.js程序只在一个线程中执行。
- Node.js每遇到一件需要操作系统支持的事情，就会使用一个单独的线程。比如说：
    - 读取文件
    - 发送网络请求
    - 定时器
    - ...
- 不会使用Node.js写计算密集型的代码，主要是IO密集型，所以不需要使用多线程

### Event Loop是什么？
- Event Loop是一个单线程的程序
- Event Loop是确定javascript程序执行的动力源

### setTimeout vs fs.readFile
- 先到先得 —— 两者回调不可能绝对同时出发
- setTimeout优先 —— fs.readFile是个可快可慢的操作，而对于setTimeout来说用户肯定希望越准确越好
- 队列顺序优先级。规则：对于用户重要的优先执行
    - timers
    - penging callbacks
    - idle, prepare
    - poll
    - check
    - close callbacks

### 宏任务与微任务
- 宏任务
    - setTimeout
    - setInterval
    - requestAnimationFrame
- 微任务
    - promise
    - yield
### 面试题
- 执行一个nodejs文件是一个进程还是一个线程？
    - 是进程中的主线程
    - 进程是：应用程序的执行副本。（os分配资源的最小单位）
        - chrome每个tab都是一个进程
    - 线程是：轻量级的进程。（os执行程序的最小单位）
    - 协程是：轻量级的线程。

- Nodejs有哪些线程
    - 主线程（用户程序 + EventLoop）
    - 线程池（执行异步任务）

- 并发和并发
    - 并发（concurrency）- 看上去同时发生
    - 并行（parallel）- 绝对的同时发生

### 模块解析

```js
//  /root/src/folder/A.ts
import { b } from './moduleB';
```
解析顺序如下：
1. `/root/src/folder/moduleB.ts`
2. `/root/src/folder/moduleB.d.ts`
3. `/root/src/moduleB.ts`
4. `/root/src/moduleB.d.ts`
5. `/root/moduleB.ts`
6. `/root/moduleB.d.ts`
7. `/moduleB.ts`
8. `/moduleB.d.ts`

```js
import { b } from 'moduleB';
```
1. `/root/src/node_modules/moduleB.js`
2. `/root/src/node_modules/moduleB/package.json` (if it specifies `"main"` property)
3. `/root/src/node_modules/moduleB/index.js`

4. `/root/node_modules/moduleB.js`
5. `/root/node_modules/moduleB/package.json` (if it specifies `"main"` property)
6. `/root/node_modules/moduleB/index.js`

7. `/node_modules/moduleB.js`
8. `/node_modules/moduleB/package.json` (if it specifies `"main"` property)
9. `/node_modules/moduleB/index.js`

如果是Typescript，那么解析顺序更加复杂一些：

1. `/root/src/node_modules/moduleB.ts`

2. `/root/src/node_modules/moduleB.tsx`

3. `/root/src/node_modules/moduleB.d.ts`

4. `/root/src/node_modules/moduleB/package.json` (if it specifies a `"types"` property)

5. `/root/src/node_modules/@types/moduleB.d.ts`

6. `/root/src/node_modules/moduleB/index.ts`

7. `/root/src/node_modules/moduleB/index.tsx`

8. `/root/src/node_modules/moduleB/index.d.ts`

   

9. `/root/node_modules/moduleB.ts`

10. `/root/node_modules/moduleB.tsx`

11. `/root/node_modules/moduleB.d.ts`

12. `/root/node_modules/moduleB/package.json` (if it specifies a `"types"` property)

13. `/root/node_modules/@types/moduleB.d.ts`

14. `/root/node_modules/moduleB/index.ts`

15. `/root/node_modules/moduleB/index.tsx`

16. `/root/node_modules/moduleB/index.d.ts`

    

17. `/node_modules/moduleB.ts`

18. `/node_modules/moduleB.tsx`

19. `/node_modules/moduleB.d.ts`

20. `/node_modules/moduleB/package.json` (if it specifies a `"types"` property)

21. `/node_modules/@types/moduleB.d.ts`

22. `/node_modules/moduleB/index.ts`

23. `/node_modules/moduleB/index.tsx`

24. `/node_modules/moduleB/index.d.ts`
