# Resizable

## overview

- add resizable handle to component
- custom resize handle

## usage

- minimal app for resizable

```
render(){
    return (
      <div>
        <ResizableBox className='box' width={200} height={200}>
          <h2> ResizableBox组件 内容</h2>
        </ResizableBox>
      </div>
    );
}
```

## api

- props(start with ! is required, others optional)
  - ! width
  - ! height

## TODO

## faq

- ResizableBox/Resizable：修改 defaultProps 的 handleSize 不起作用
  - 目前 handleSize 只定义了，未使用
  - 修改 handleSize 的同时要修改 css
