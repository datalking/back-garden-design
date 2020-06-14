# incubator components

- proof of concept
- component playground for practice and test

## react-window

- overview
  - React components for efficiently rendering large lists and tabular data
  - https://github.com/bvaughn/react-window
- features
  - small and fast
  - addons: react-vtree, auto-sizer
- drawbacks
  - 功能简洁，但很少
  - 使用键盘滚动只能滚动一次，后续失效
  - 不支持渲染 tr,td 的方式实现列表，若要兼容以前 td 的表格和样式，需要自己实现，可参考 window-table
    - 若支持渲染成 tr 和 td，则可直接使用 bootstrap 的表格样式名
    - 社区开发者实现了列表内容渲染成 tr-td
- dependencies: memoize-one, react

## react-table

- overview
  - a lightweight, fast and extendable datagrid built with React
  - https://github.com/tannerlinsley/react-table
- features
  - Lightweight at 11kb (and just 2kb more for styles)
  - Fully customizable (JSX, templates, state, styles, callbacks)
  - Column-definition-driven. No composition needed.
  - Client-side & Server-side pagination
  - Multi-sort
  - Filter
  - Pivoting & Aggregation
  - Minimal design & easily themeable
  - Controllable via optional props and callbacks everywhere possible
  - addons: foldableTable, treeTable,...(hoc as addon)
- drawbacks
  - ReactTable 组件属性有超过 50 个，属性间关联多，不便于阅读
  - 没有编写单元测试
  - react-table v6 的设计是基于分页的，没有处理 scroll 事件，因为移动端的滚动列表体验不好
  - react-table 基于 pagination 分页显示，若手动控制每页显示过多行的数据，仍会存在性能问题
  - cell edit not supported，社区有实现
  - Virtualizable in v7
  - Animatable in v7
  - hooks in v7
  - v7 is rewrite, not compatible to v6
  - performance issue
    - filter is slow( architecture of v6 limits us from doing this, v7 rewrite)
- dependencies: classnames

## react-data-grid

- overview
  - Excel-like data grid component built with React
  - https://github.com/adazzle/react-data-grid
  - http://adazzle.github.io/react-data-grid/
- features
  - Lightning Fast Rendering by smart windowing
  - Rich Editing and Formatting for cells
  - Configurable & Customizable
  - Packed common Excel Features
    - keyboard navigation
    - context menu
    - cell copy & paste
    - cell drag down
    - column sort, filter, frozen, resize
- drawbacks
  - pivot not powerful
  - 列表样式依赖 bootstrap.css 和 bootstrap-theme.css
  - 不支持分页
  - 不支持合并单元格，即也不支持分组合并列
- dependencies: classnames, immutable, shallowequal, react-is, tslib
- docs
  - The grid data is virtualized both for rows and columns to improve rendering and scrolling performance
  - migrate all the grid interaction functionality to separate layer known as the InteractionMask to improve interaction performance
    - InteractionMask keeps track of the selected cell `{idx, rowIdx}` in state
    - InteractionMask does not know how to relate coordinates on the screen to an actual cells position on the grid
    - InteractionMask needs to listen to events from the Cell component
    - InteractionMask and Cell sit at the same level in the component heirarchy
  - InteractionMask 的类别
    - SelectionMask
      - to control cell selection and navigation on the grid
      - The InteractionMask keeps track of the selected cell {idx, rowIdx} in state
    - EditorContainer
      - cell edit
      - InteractionMask keeps track of which cell is being current edited
      - EditorContainer will render an editor as defined by column.editor
      - Once commit has been called, this callback will propogate up to the root ReactDataGrid component and fire an onGridRowsUpdated event
      - By default, each cell of ReactDataGrid is readonly
    - DragMask
      - drag
    - CopyMask
      - when a cell is pasted or copied from
    - CellRangeSelectionMask
      - a range of cells is selected
  - EventBus object
    - allow for easier communication between sibling components, as well as to provide a way for components to propagate state changes to their descendants deep in the component hierarchy
    - Cell {idx:0,rowIdx:0} is selected with mouse or keyboard
    - SelectCell event is dispatched on EventBus
    - InteractionMask receives SelectCell event which it subscribe to in componentDidMount
    - InteractionMask updates SelectionMask with new selectedPosition coordinates
  - EditorContainer will call commit
    - When the user clicks Enter from the primary input of the editor
    - When the user clicks Tab from the primary input of the editor
    - When the primary input of the editor is unfocussed
    - When the onCommit prop is called manually by the editor
  - Cell Update scenarios
    - Using the supplied editor of the column. The default editor is the SimpleTextEditor.
    - Copy/pasting the value from one cell to another CTRL+C, CTRL+V
    - Update multiple cells by dragging the fill handle of a cell up or down to a destination cell.
    - Update all cells under a given cell by double clicking the cell's fill handle.
  - addons
    - cell editors, formatters, draggable, filters, toolbar, tools-panel, menu, data operation functions
- changelog
  - v2-201701-export two packages: core and addons
  - v3-201707-migrate to es6 class
  - v4-201804-migrate to react-context-menu and react 16
  - v5-201810-rewrite the core to improve cell navigation and scrolling performance
  - v6-201811-upgrade build tools to latest versions, use react portals for cell editors
  - v7-201904-migrate to typescript(since v7.0.0-alpha.2)

### limitations

- div 嵌套层次过多(带来的好处是更新数据影响范围小)

### source-code

- general
  - 首次渲染 ReactDataGrid 组件时，最外层 div(react-grid-Container)未加载，此时宽度设置为 100%，挂载完后会立即计算父元素宽度，重新 render 子组件
  - 本组件默认会使用本组件父元素的宽度作为最外层 div 的宽度
  - rowGetter、rowCount 属性值为函数的作用是方便排序过滤分组计算
- column & row
- column
  - 出现水平滚动条的条件是均分总宽度后每列宽度小于 minColumnWidth
    - By default, Grid will try and divide the total width equally amongst the number of columns, until the column widths would be below a minColumnWidth (in px) beyond which we automatically scroll horizontally.
- row
- cell
  - React Data Grid uses an absolutely positioned extra div for the so called cell-mask
  - enableCellSelect 设为 false 后，单元格就不可编辑了
- header
  - 表头的列过多时，可以自动显示水平滚动条，此时 HeaderRow 最右边单元格边框会因滚动而隐藏，无问题，列总宽度不够宽时，显示不友好
    - 另一种方式是将整个 header 视为放在列表之上，这样数值滚动条上侧也会显示一个短边
    - 效果类似 https://www.ag-grid.com/javascript-grid-column-header/
- sort
- scroll
  - canvas 所在 div 最右侧滚动条的宽度是 15px，且始终显示
  - 竖直滚动条和表格右侧边框之间有很窄的间隔，逼死强迫症，解决方法是隐藏竖直滚动条
- style
  - cell-action-button 和 cell-expand 两处使用了 display:table/-cell
  - cell-action-menu/expand 使用了 float
- xp
  - ReactDataGrid 组件重要的默认初始值
    - rowHeight 为 35，minHeight 为 350，即默认显示 10 行(算上表头行)，若超过 9 行数据，则显示竖直滚动条
    - minColumnWidth 为 80，表格总宽度默认填满父容器，均分总宽度后得到的每列宽度若小于 80，则显示水平滚动条
  - For the minimum setup, ReactDataGrid requires the following props:columns, rowGetter, rowsCount
  - By default, each cell of ReactDataGrid is readonly
    - 要支持单元格编辑需要先将 column 的 editable 设为 true，然后提供 onGridRowsUpdated 方法更新行数据，再将 enableCellSelect 设为 true
  - edit cell by keyboard or drag-fill
  - rdg is having default tooltip to each cell. It adds the title attribute automatically
  - 数据 virtualization 是为了提升交互操作的性能，如 scroll, cell navigation
- eventBus 对象
  - 数据示例
  ```
  {
      subscribers: Map(6)
  }
  ```
  - Map 的 key 为 SELECT_CELL/SELECT_START/SELECT_UPDATE/SELECT_END/DRAG_ENTER/SCROLL_TO_COLUMN，值都是 Set(0)
- onGridRowsUpdated
  - 方法支持的参数包括 cellKey, fromRow, toRow, fromRowId, toRowId, rowIds, updated, action, fromRowData
- custom
  - 自定义 filter
    - 默认使用的是 FilterableHeaderCell 组件作为表头可过滤单元格，自定过滤器可参考 NumericFilter
    - 会被传入的 props 包括 column， onChange(onAddFilter), getValidFilterValues
    - 过滤条件输入框的事件处理函数可以添加或删除过滤词条，还可以包括 filterTerm,column，还有 rawValue，filterValues
    - 自定义 filter 要实现 filterValues()方法，因为 data-selector 中会调用 RowFilterer 的 filterRows()

## todo

- column & row -[ ] 高亮当前激活单元格所在行和所在列，设置开关 -[ ] 竖直滚动条出现的条件是均分后每列高度小于 minRowHeight，水平滚动条出现的条件是均分后每列宽度小于 minColumnWidth -[ ] 滚动条替换为跨浏览器一致的 perfect-scrollbar -[ ] 显示或隐藏最左边的行号和最上边的列号 -[ ] 每行或每列前面考虑一个占位符区域，可实现拖拽、折叠展开 -[ ] 对于简单表格，可直接 switch row & column -[ ] Grid 组件不显示边框，边框直接由 cell 显示，达到 div-border-collapse 的效果 -[ ] drag-fill - 只支持竖向拖拽，暂不支持水平拖拽 - 拖拽结束时高亮单元格应该停留在最后一格，现在是停留在原位置 - 区分不同操作的鼠标图标：drag-fill 加号(crosshair)，drag-move 准星(move)，drag-range-select 十字条(cell) - chrome 和 firefox 的鼠标图标中 move 和 grabbing 图标相同 -[ ] 合并单元格 - 合并同一行的 - 合并同一列的 column spanning - Range Selection will not work correctly when spanning cells. This is because it is not possible to cover all scenarios, a range is no longer a perfect rectangle
- column -[ ] 支持列分组合并，即分组表头 -[ ] 列折叠 -[ ] 通过拖拽改变列宽 - 列的最小宽度考虑缩小，因为目前最小列宽过大，不能往左拖动，体验不好 - auto size -[ ] column sort - 支持列拖拽交换顺序 - 动画效果是一个列一个列地交换 -[ ] 重复一列的数据，此时 key 会重复，列数过多时自动显示水平滚动条 -[ ] column frozen 固定列到左边或右边 -[ ] column spanning 合并列，类似于合并单元格，合并列后只是右侧边框不见了，数据仍是网格显示 -[ ] 单元格类型标记或列类型标记，如下拉菜单、注释、标签 -[ ] 选择整列 -[ ] column filter -[ ] 提示表头列，即第一行列内容悬浮预览，使用场景是滚动到其他位置时看不到表头了
- row -[ ] ！ RDG 的 rowGetter 属性除了支持函数，还支持字符串，同时增加 data 属性直接传入数组数据 -[ ] ！ 添加 showHeaderShow 属性 -[ ] 行中单元格右侧分隔线支持面包屑三角形 -[ ] 行折叠 -[ ] 通过拖拽改变行高 -[ ] row sort - 拖拽改变行顺序 - 行自动排序(通过列文字旁的图标)时显示动画 -[ ] row forzen 固定行到上边或下边 -[ ] full width row -[ ] accordion-like rows via sub-component -[ ] 选择整行
- header -[ ] 分组表头 -[ ] 支持多级表头 header，最多 3 级 - 表头单元格具有右侧悬浮菜单 - 最下层表头支持 filter，点击表头名文字排序，groupBy，pinCol,collapse,autosizeCol - 上层表头支持 collapse -[ ] 自定义 header 单元格的分隔线 -[ ] 表头文字的对齐方式，左中右 -[ ] 数据不够宽时，Grid 和 Header 组件右侧 border 都会显示，若此时竖直滚动条隐藏，右侧会不优雅 - 若数据总宽度不够宽，则考虑隐藏 Grid 的右边，同时将 Header 组件 background 颜色删除 - 若数据总高度不够高，则考虑隐藏 Grid 的下边
- cell -[ ] 拖动单元格填充数据完成后，当前活跃单元格未移动到最后一个填充的单元格 - 不能横向拖动！！！ -[ ] 编辑单元格需要 3 个设置项，要简化，enableCellSelect 应自动设置 -[ ] 单元格双击事件要提高性能，双击事件前会先执行两次单击，单击事件前会先执行 mousedown/up - 针对不可编辑的单元格简化双击事件 -[ ] 编辑 cell 内容到宽度超过指定宽度，若是最后一列，则类似 excel 显示内容到该行最右边 -[ ] 支持数学公式原样显示，或显示计算结果
- interaction-mask -[ ] 首次渲染默认不存在当前活跃单元格，只有鼠标操作后才存在，现在默认显示左上角的第一个单元格 -[ ] 对于列表类数据，可以不存在指示器，应该设置 IMASK 的开关
- sort -[ ] 支持多列排序，multi-sort
- scroll -[ ] 在数据不足一页时，隐藏竖直滚动条，定位在 Canvas 组件的最外层样式 - 避免像 handsontable 那样的滚动条会挡住表头 -[ ] 很慢地下拉滚动时上边框即将隐藏的那一行外边界会有空白，因为只 overscan 了一个方向，上拉时下边框边界行右边框会有空白 - firefox 自动隐藏滚动条宽度，注意处理双边框，以及隐藏的那一行的右边框缺失了像破口
- keyboard
  - 使用键盘移动到最左列时，会先到行号列，再到刚滚动出来的数据列
- pagination -[ ] client-side -[ ] server-side
- group/aggregate/pivot -[ ] row group
- extension
  - context menu
  - status bar
  - tool panel/side bar
  - overlay
    - loading
    - excel-online 的图表层
- base-component
  - date-picker
  - floating-button
- ready-component
  - FixedSizeList
    - 目标是直接可用的各项等高的列表
    - 不支持显示水平滚动条
    - 不支持编辑单元格
- interaction
  - keyboard
  - touch
  - i18n

## use case

- grid 和 list 在使用场景和功能上有区别
  - grid 更专注于编辑功能，list 更专注于展示与渲染功能，list 更常用
  - excel-like 编辑器**基于 grid 专门设计**，因为不需要表头
  - 在某些功能难以实现时，考虑拆分为 2 个组件，只共用底层基础组件，上层组件重写
    - 表头处理，grid 需要行列号索引表头
    - 还可以考虑，在编辑单元格时使用 grid，分享时使用 list
  - 选择要用的组件的依据
    - 是否要显示水平滚动条，list 不会显示水平滚动条
    - 是否需要编辑数据，list 不直接提供编辑器可自己开发，grid 直接双击编辑
    - 是否需要列操作和单元格操作，以及操作复杂度
- 行
  - grid 的行更简单，list 的行一般较复杂，可嵌套多层
  - list 的行左右两边无边框，因为无单元格，所有行中间也没有边框竖线
  - list 的行与行之间可以有间隔，行可以有类似色块条背景
- 列
  - list 一般没有列的概念，或列相关操作较少
- 单元格
  - list 一般无单元格，或将整行作为一个单元格处理
- 表头
  - grid 和 list 都需要支持表头全部操作
  - 分页、过滤功能借助于顶部或底部工具栏
  - 无竖直滚动条时的表头
    - list 表头宽度 = 所有列的宽度和
    - grid 始终显示竖直滚动条
  - 有竖直滚动条
    - list 表头宽度 = 所有列的宽度和 + 竖直滚动条宽度，表头视觉上压着数据列表，表头右侧不会被遮挡(需重写样式)
    - grid 表头宽度 = 所有列的宽度和 + 竖直滚动条宽度，表头右侧会被遮挡(维持现状)
- 滚动
  - **grid 始终展示水平和竖直滚动条**
  - **list 不会显示水平滚动条**，需要时才显示竖直滚动条，这需要动态调整表头宽度

## fixme

-[ ] column resize 表头单元格宽度先变化，该列单元格才变化，明显感觉到延迟

## later

- NumericFilter remove onkeypress
  - onkeypress event handler has been deprecated. You may want to use onkeydown instead.
  - 写起来`>99`和`<2`，过滤结果实际上包含边界值，这里与数学逻辑冲突；9-10 的区间包含两个边界值无问题
- reimplement AutoCompleteFilter addon to remove dependencies on reselect,react-dnd
- 移动端显示及体验测试
- refactor UNSAFE_componentWillReceiveProps to getDerivedStateFromProps
  - react-table 和 react-data-grid
- ReactDataGrid 组件首次渲染宽度为 100%，列宽为默认值 80，DidMount 方法中会立即更新宽度为容器宽度再次 render，要避免二次渲染
- cell edit 时，双击单元格会先触发两次 onClick，最后才触发 onDoubleClick，需要优化，可使用 cancelablePromise
- 表格数据更新时会调用 onGridRowsUpdated 方法更新数据源对象，会导致表格组件整体 rerender，如何通过数据分片实现代价最小的更新
  - 使用 window 虚拟化后，每次 render 的 DOM 结构也不多，也许对性能影响不大
- 基于 flexbox 实现 list
- 针对浏览器优化
  - firefox 会自动隐藏滚动条宽度，所以要注意处理右侧边框的空白

## done

-[x] add simple super header group -[x] remove bootstap.css - FilterableHeaderCell 组件使用了 form-group,form-control - 待确认：row-selected,has-tooltip, -[x] remove immutable-js

## merge-log

- 20191116-7.0.0.alpha22-bug fix
- 20191012-7.0.0.alpha20-bug-fix

## faq

- RDGTableEditApp 实例首次渲染表格时，会调用 2 次 ReactDataGrid 组件的 render 方法，如何优化？
  - gridWidth-grid-parentElement 会调用 2 次，依次为
    - null
    - `<div id="main">`子元素是 react-grid-Container
  - containerWidth 依次为 100%, 918px
  - cell 宽度依次为 80，动态计算 width/columnCount
  - containerWidth 是局部变量，在第二次调用 render 前，是如何从 100%变成父元素像素值 918px 的 ?
- 单元格编辑时，双击单元格为何会触发 ReactDataGrid 组件的 componentWillReceiveProps 方法

## bug-fix

- onGridRowsUpdated called twice on click away outside of the grid
  - https://github.com/adazzle/react-data-grid/issues/1061
  - resolved since 6.1.0
