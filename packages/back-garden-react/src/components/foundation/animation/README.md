# Animation

## overview

- easy animation for an array of items

## usage

- minimal app for animation

```

```

## api

- ## props(start with ! is required, others optional)

## faq

- 难点
  - 在不同生命周期将动画更新加入异步任务队列，调试起来很乱
- tick()执行完后，为什么执行 animate()方法
  - 动画更新时加入异步任务的顺序
  - 先在 getDerivedStateFromProps 中将更新的 queue()加入异步任务队列
  - 回到主线程，执行到 componentDidUpdate()将 animate()加入异步任务队列
  - 执行异步任务队列中的 queue()和 start()方法，此时将 tick()加入异步任务队列
  - 执行异步任务队列中的 animate()，此时又会执行到 componentDidUpdate()，但不会再加 animate()
  - 执行异步任务队列中的 tick()
  - ？？？之后 tick()和 animate()会交替执行，组件会被刷新，动画就显示出来了
