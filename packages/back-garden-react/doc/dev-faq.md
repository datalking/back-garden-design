# dev-faq

- 使用 styled-components 而不是 emotion 的原因
  - 开发用到的`styled`的方法，只使用 styled-components 和 emotion 公共的 api
  - ThemeProvider 使用的是 s-c 提供的
  - s-c v5 重写后 wrapper hell 嵌套层次很少了，比 emotion v10 简洁
- 使用 styled，而不是 className 的原因
  - 使用 className 很难在单独的方法中获取 props 再返回样式对象或字符串，不方便实现动态样式
  - 使用 styled 形式和 css prop 形式的组件都会造成 wrapper hell，好处是在高阶组件中容易获取 props 并计算
