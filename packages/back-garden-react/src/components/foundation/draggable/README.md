# Draggable

## overview

- add draggable ability to component

## usage

- minimal app for draggable

```

```

## api

- props(start with ! is required, others optional)
  - ! onStart
  - ! onDrag
  - ! onStop

## TODO

## faq

- DraggableCore.handleDragStart()中给 document 添加 mousemove 监听器为什么使用捕获阶段
  - addEventListener 方式其实对 capture 或者 bubble 都无影响，因为反正都是监听在 document 之上，不管鼠标多快，不管是不是超出目标元素的范围，mousemove 事件都会发生，所以总会把目标元素移动到指定鼠标的位置
- slackX/Y 的作用是什么
