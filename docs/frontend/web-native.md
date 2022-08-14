# Web Native

## 如何实现平滑滚动效果
1. css方法
```css
.main {
  scroll-behavior: smooth;
}
```

2. js方法
```js
function scroll() {
  const el = document.querySelector('#el')
  el.scrollIntoView({
    behavior: 'smooth'
  })
}
```