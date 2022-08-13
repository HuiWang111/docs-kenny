# Vue

### vue3(vue-next)重新定义了vue的程序该如何写
- jsx
- typescript
- Composition API
- reativity

### why not sfc ?
`SFC` 需要的 `templete` 和 `script` 的方式有两个缺点：
- 这样设计不够灵活
    - 需要 v-show/v-if/v-for 等
- ts类型检查
    - 函数组件可以最大程度复用ts的类型检查

### composition api
- 初始化定义组件
    - setup
    - defineComponent
- 响应式数据
    - ref
    - reactive
    - toRefs
    - computed
    - watch
    - watchEffect
- 生命周期
    - onMounted
    - onUnmounted

总的来说 `composition` api有以下优点：
- 提升了组合能力
- 提供了Reactive Programming (响应式编程)
- 提供了函数式

### 声明式
- 声明式需要更好的封装
```js
const arr = [];
for (let i = 0; i < 10000; i++) {
    arr[i] = i;
}

// 声明式
const arr = range(999);
```

- 声明式会创造语言
```jsx
const div = document.createElement('div');
div.style.width = 100;

// 声明式
const div = <div style={{ width: 100 }} />;
```
- 声明式往往都是 `Reactive` 的，反之亦然
- 声明式帮助我们更好的阅读代码

### Reactive
当一个值是reactive时，那么它具备以下能力：
- 它可以通知(trigger)
    - vue更新
    - vue做其他标准行为
    - 完成自定义的行为
- 它可以监听(track)
    - vue发生的变化