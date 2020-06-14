import React from 'react';
import { AnimateProps } from './interfaces';
import NodeGroup from './NodeGroup';
import { numeric } from './util';

const keyAccessor = () => '$$key$$';

/**
 * 借助NodeGroup给单个children元素状态的改变添加动画
 * If you have a singe item that enters, updates and leaves，使用Animate组件
 */
class Animate extends React.Component<AnimateProps, {}> {
  static defaultProps = {
    show: true,
    interpolation: numeric,
  };

  componentDidMount() {
    // console.log('====Animate componentDidMount');
  }

  componentDidUpdate(prevProps) {
    // console.log('====Animate componentDidUpdate');
  }

  render() {
    console.log('====props4 Animate');
    // console.log(this.props);

    const { show, start, enter, update, leave, interpolation, children } = this.props;

    // 每次调用render()都会创建一个新的代表初始状态的data
    // 所以尽管start()返回的初始状态内容相同，但NodeGroup的getDerivedStateFromProps中data引用不相等
    const data = typeof start === 'function' ? start() : start;
    // console.log('Animate-data, ', data);

    return (
      <NodeGroup
        data={show ? [data] : []}
        start={() => data}
        keyAccessor={keyAccessor}
        interpolation={interpolation}
        enter={typeof enter === 'function' ? enter : () => enter}
        update={typeof update === 'function' ? update : () => update}
        leave={typeof leave === 'function' ? leave : () => leave}
      >
        {nodes => {
          // console.log('====Animate-children-nodes-param, ', nodes);
          // console.log('====Animate-children-nodes[0].state, ', nodes[0].state);

          // 若传入的是空数组，则渲染null，否则调用children()方法将传入的数据渲染为内容
          if (!nodes[0]) {
            return null;
          }

          // Animate组件只处理单个元素节点的动画，取出中间数值
          const renderedChildren = children(nodes[0].state);
          return renderedChildren && React.Children.only(renderedChildren);
        }}
      </NodeGroup>
    );
  }
}

export default Animate;
