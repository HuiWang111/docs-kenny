# React

### 词汇
- intrinsic 内部的
    - 如 `<h2></h2>` 被称为 React内部组件 `React.IntrinsicElement.h2`

### React Hooks
- 作用
    - 让 `React` 更好的拥抱函数式编程
    - 更好的解决组合问题 (关注点分离)
- 原理
    - 从原理上它们是钩子 `hook`，当React声明周期发生变化的时候，会触发它们

### 如何理解 `React Hook` 让 `React` 更好的拥抱函数式
- 组件是一个用来渲染的纯函数
    - 不再需要关注生命周期
    - 不再需要理解生命周期
    - 更接近于React `component = f(data)` 的理念
- 细化解决用户痛点
    - 针对状态、作用、上下文、缓存方面，为用户量身定做了 `hook` 函数
- 让用户以最小的代价实现关注点分离

### Hook本质
- 本身是一种消息(通知)机制
- 从系统外部监听系统内部的变化，并且和某种特定的事件相关

### React Hook做了什么
- 如 `useEffect` 当React渲染的时候会触发这个hook，如果hook上的依赖发生变化那么就执行对应的函数
- 如 `useState` 是一种反向hook，当状态发生变更时，会反向触发React的更新

### 如何描述对 `React Hook` 的理解
- hook(钩子)是什么
    - 通知机制，举例：`git hook`, `windows hook`
- 函数式编程的拥抱
    - 重新定义了组件的写法，让用户不再需要关注生命周期
    - 更好的支持了关注点分离

### React核心设计原则是什么?
- Learn once Write Anywhere
- 专注做好渲染工作
- Uniform(统一): 最简化、最标准化的表达

### React 18
- setState所有情况下都是异步
- SSR支持lazy
- concurrent模式（并发模式）带来的useTransition/useDeferredValue等
- Suspense

### Fiber
- Fiber是什么？
    - 是React Element数据的镜像
    - 是一份Diff工作
    - 模拟了函数调用关系
```js
function FiberNode(...) {
    // 工作类项（Fiber类型）
    this.tag = tag;

    // ReactElement.key
    this.key = key;

    // ReactElement.type
    this.elementType = null;

    // Fiber父节点，执行完当前工作返回的Fiber
    this.return = null;

    // 当前Fiber的（最左侧）子Fiber
    this.child = null;

    // 当前Fiber下一个同级Fiber
    this.sibling = null;
}
```
- workInProgress
    - 每个fiber都有自己的WorkInProgress。当发生变更时，原本的Fiber不变，而构造一个WorkInProgress Fiber。当WorkInProgress构造好之后，原本的Fiber和WorkInProgress Fiber互相引用。
    - 本质上是处理并发的一个技巧，叫做 `copy on write`，当有变更的时候，先复制原先的对象，修改完成之后再替换原先的对象
- 两个阶段
    - 计算阶段（可中断）
        - 计算Work In Progress Fiber
        - 进行DOM Diff，计算DOM Diff的更新
    - 提交阶段（不可中断）
        - 提交所有更新
- 驱动Fiber执行有很多种情况，主要的三种是：
    - 根节点的render函数调用（例如：`ReactDOM.render(<App />)`）
    - setState
    - props变更
- Fiber的执行过程
    - 如果是新节点，那么创建Fiber
    - 计算阶段：如果是变更，那么计算Work In Progress Fiber
    - 计算阶段：render库执行，利用React的DOM DIFF算法计算更新
    - 提交阶段：应用更新
