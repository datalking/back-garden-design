# react-table

- overview
  - a lightweight, fast and extendable datagrid built with React
  - https://github.com/tannerlinsley/react-table
- features
  - Lightweight at 11kb (and just 2kb more for styles)
  - Fully customizable (JSX, templates, state, styles, callbacks)
  - Column-definition-driven. No composition needed.
  - Client-side & Server-side pagination
  - Multi-sort
  - Filters
  - Pivoting & Aggregation
  - Minimal design & easily themeable
  - Controllable via optional props and callbacks everywhere possible
- drawbacks
  - ReactTable 组件属性有超过 50 个，属性间关联多，不便于阅读
  - 没有编写单元测试
  - react-table v6 的设计是基于分页的，没有处理 scroll 事件，因为移动端的滚动列表体验不好
  - react-table 基于 pagination 分页显示，若手动控制每页显示过多行的数据，仍会存在性能问题
  - cell edit not supported，社区有实现
  - Virtualizable in v7
  - Animatable in v7
  - hooks in v7
  - performance issue
    - filter is slow
    - the architecture of v6 limits us from doing this
    - This is one of the reason for our v7 rewrite to hooks
    - https://spectrum.chat/react-table/general/render-table-is-slow-when-using-filtering~5028c1fc-e1f8-4586-87ff-d228d85c5fb0
    - https://stackoverflow.com/questions/47945800/react-table-with-75k-rows-is-very-slow-and-cpu-expensive
    - https://github.com/tannerlinsley/react-table/issues/700
- dependencies
  - classnames
- docs
  - **Pivoting** the table will group records together based on their accessed values and allow the rows in that group to be expanded underneath it.
  - To pivot, pass an array of columnID's to pivotBy.
  - a column's id is either the one that you assign it (when using a custom accessors) or its accessor string.
  - Naturally when grouping rows together, you may want to **aggregate** the rows inside it into the grouped column.
  - No aggregation is done by default, however, it is very simple to aggregate any pivoted columns
  - table 组件内容从上到下的结构：上排分页指示器、列合并分组、单列标题、过滤器、数据行主体、占位空行、列尾、下排分页指示器、空数据占位组件、数据加载组件
