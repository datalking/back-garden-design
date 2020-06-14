# Listable

## overview

- easy list or grid

## usage

- minimal app for Listable

```

```

## api

- ## props(start with ! is required, others optional)

## features

- ability
  - sort/multi-sort
  - filter
  - group/pivot/aggregate
  - pagination client/server-side
  - customizable anything via callbacks
    - callbacks for styling, events
- appearance
  - column & row
    - collapsable
    - fixed/frozen
  - column
    - grouped header
    - reorder
  - ## row

## limitations

- ## column & row
- ## column
- ## row

## faq

- 使用多个高阶组件扩展时，如 collapsableColumn/Row、selectableRow，列表的 ref 如何处理
- 检测是否点击到组件的外面
  - 可以考虑在 document 对象上设置监听器
  - 使用 ReactDOM.createPortal(child, container)后又会变得复杂
- 表格如何切换主题样式
  - react-data-grid 自带组件结构方面的样式，再利用 bootstrap-theme-css 渲染更优雅的表格
  - 修改 index.html 的 link 导入的样式后，必须强制刷新网页才能在表格中显示新添加或修改的样式(codesandbox)
- div-border-collapse 的问题
  - 负值 margin 或父上左子右下
