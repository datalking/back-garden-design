import React from 'react';
import { NodeGroupProps } from './interfaces';
import { interval } from '../../../helper/d3-timer';
import BaseNode from './BaseNode';
import { numeric } from './util';
import mergeKeys from './mergeKeys';

export const ENTER = 'ENTER';
export const UPDATE = 'UPDATE';
export const LEAVE = 'LEAVE';

interface NodeGroupState {
  // ANode是class类型,{data:{x:0},key:'$$key$$',state:{x:0},type:'ENTER',getIntpl:numeric}
  ANode: any;
  // [{x:0}]
  data: any;
  // {$$key$$:ANode}, nodeHash = nodeKeys[] -> nodes[]
  nodeHash: any;
  // ['$$key$$']
  nodeKeys: any[];
  // ANode[]，会传递给Animate组件的children()，包含中间态数值
  nodes: any[];
}

/**
 * 给children内容状态的改变添加动画
 * If you have an array of items that enter, update and leave，使用NodeGroup组件
 */
class NodeGroup extends React.Component<NodeGroupProps, NodeGroupState> {
  /** 属性默认值，3个主要函数都是空函数 */
  static defaultProps = {
    enter: () => {},
    update: () => {},
    leave: () => {},
    interpolation: numeric,
  };

  /** 基于Timer的interval定时器对象 */
  interval = null;
  /** 组件是否在卸载 */
  unmounting = false;

  constructor(props) {
    super(props);

    const { interpolation } = props;

    /** 代表将要执行动画的节点，包含动画类型和执行动画的数据。
     *  新增3个属性data/key/type，基类2属性state/transitionData。
     *  FIXME 将ANode提取到单独文件 */
    class ANode extends BaseNode {
      /** 节点数据 */
      data: any;
      /** 节点数据对应的key */
      key: any;
      /** 节点要执行动画的类型，默认enter，三选一，enter/update/leave */
      type: any;

      constructor(key, data) {
        // super();
        super(undefined);

        this.data = data;
        this.key = key;
        this.type = ENTER;
      }

      getInterpolator = interpolation;
    }

    // eslint-disable-next-line react/no-direct-mutation-state
    this.state = {
      ANode,
      data: null,
      nodeHash: {},
      nodeKeys: [],
      nodes: [],
    };
    // console.log('==== NodeGroup initial state: ');
    // console.log(this.state);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('====NG getDerivedStateFromProps:');
    // console.log(nextProps);
    // console.log(prevState);
    console.log('nextP.data !== prevS.data, ', nextProps.data !== prevState.data);

    if (nextProps.data !== prevState.data) {
      const { data, keyAccessor, start, enter, update, leave } = nextProps;
      const { ANode, nodeKeys, nodeHash } = prevState;

      // 根据prevState中nodeKeys的各项创建字典，以key为键，以key的索引号为值，即对调kv
      const keyIndex = {};
      for (let i = 0; i < nodeKeys.length; i++) {
        keyIndex[nodeKeys[i]] = i;
      }
      // console.log('keyIndex, ', keyIndex);

      // 创建一个字典，以nextProps中data的各项key为键，索引号为值
      const nextKeyIndex = {};
      // 用数组存放各项键
      const nextNodeKeys = [];

      // 遍历nextProps中的各数据项(对于Animate只有1项数据)，对不在keyIndex中的数据创建节点
      for (let i = 0; i < data.length; i++) {
        const d = data[i];
        // 获取数据项对应的key，对于Animate始终返回$$key$$
        const k = keyAccessor(d, i);
        // console.log('current k, ', k);

        nextKeyIndex[k] = i;
        nextNodeKeys.push(k);

        // console.log('keyIndex[k], ', keyIndex[k]);
        // 检查data的k键在已有的nodeKeys数组中是否存在，若不存在，则创建一个节点并加入已有的nodeHash字典
        if (keyIndex[k] === undefined) {
          const node = new ANode();
          node.data = d;
          node.key = k;
          node.type = ENTER;
          nodeHash[k] = node;
        }
      }
      // console.log('nextKeyIndex, ', nextKeyIndex);
      // console.log('nextNodeKeys, ', nextNodeKeys);

      // 遍历prevState中的nodeKeys，找出需要执行update动画的节点
      for (let i = 0; i < nodeKeys.length; i++) {
        const k = nodeKeys[i];
        const n = nodeHash[k];

        // console.log('nextKeyIndex[k], ', nextKeyIndex[k]);
        // 若已有nodeKeys中的对应的ANode对象在nextProps中也存在，则标记该节点需要update
        if (nextKeyIndex[k] !== undefined) {
          n.data = data[nextKeyIndex[k]];
          n.type = UPDATE;
        } else {
          // 若已有节点在nextProps中不存在，则标记该节点需要leave
          n.type = LEAVE;
        }
      }
      // console.log('nodeHash-type-updated, ', nodeHash);

      // 合并已有节点和待更新节点的key，Animate就只返回['$$key$$']
      const mergedNodeKeys = mergeKeys(nodeKeys, keyIndex, nextNodeKeys, nextKeyIndex);
      // console.log('====mergedNodeKeys, ', mergedNodeKeys);

      // 遍历所有节点，根据各节点动画类型调用相应方法执行动画
      for (let i = 0; i < mergedNodeKeys.length; i++) {
        const k = mergedNodeKeys[i];
        const n = nodeHash[k];
        const d = n.data;

        // 若类型是入场动画，则获取初始state并执行enter
        if (n.type === ENTER) {
          // 初始进入页面都会执行这里，因为type默认是enter
          const startState = start(d, nextKeyIndex[k]);
          console.log('startState, ', startState);
          n.setState(startState);
          // enter()初始值为空方法，此时enterState为undefined
          const enterState = enter(d, nextKeyIndex[k]);
          // console.log('enterState, ', enterState);
          n.transition(enterState);
        } else if (n.type === LEAVE) {
          // 若类型是离场动画，则执行leave
          const leaveState = leave(d, keyIndex[k]);
          console.log('leaveState, ', leaveState);
          n.transition(leaveState);
        } else {
          // 若类型是更新动画，则执行update
          // 注意实际是将更新任务加入queue，会立即返回并执行主线程任务到NG componentDidupdate，
          // 而这时animate也会加入queue，所以此时会执行先加入队列的BaseNode-init()中的queue()和start()方法

          // 调用传入的update()，获取更新后的最终状态，如{x:[200],timing:{duration:200}}
          const updateState = update(d, nextKeyIndex[k]);
          // console.log('updateState, ', updateState);
          n.transition(updateState);
        }
      }

      // 返回更新后的state
      return {
        data,
        nodes: mergedNodeKeys.map(key => {
          return nodeHash[key];
        }),
        nodeHash,
        nodeKeys: mergedNodeKeys,
      };
    }

    return null;
  }

  componentDidMount() {
    // 挂载后就会默认开始执行动画，这里有调用interval方法，但会自动调用stop()
    console.log('====NG componentDidMount startInterval');
    this.startInterval();
  }

  componentDidUpdate(prevProps) {
    console.log('====NG componentDidUpdate');

    const needStartInterval = prevProps.data !== this.props.data && !this.unmounting;
    // console.log('prevProps.data, ', prevProps.data);
    // console.log('this.props.data, ', this.props.data);
    console.log('====NG needStartInterval, ', needStartInterval);

    if (needStartInterval) {
      this.startInterval();
    }
  }

  /**
   * 总会调用animate()方法，animate方法最后总会setState，所以会再次触发getDerivedStateFromProps
   */
  startInterval() {
    // console.log('====startInterval-!this.interval， ', !this.interval);
    // 若interval值为null
    if (!this.interval) {
      // 初次调用interval()方法，返回Timer定时器对象
      this.interval = interval(this.animate, undefined, undefined);
    } else {
      // 重用interval定时器对象，将animate加入任务队列
      this.interval.restart(this.animate, undefined, undefined);
    }
  }

  componentWillUnmount() {
    const { nodeKeys, nodeHash } = this.state;

    this.unmounting = true;

    // 卸载前先停止定时器
    if (this.interval) {
      this.interval.stop();
    }

    nodeKeys.forEach(key => {
      nodeHash[key].stopTransitions();
    });
  }

  animate = () => {
    console.log('====NG-animate()-start');
    const { nodeKeys, nodeHash } = this.state;

    if (this.unmounting) {
      return;
    }

    // 动画是否正在进行，默认false未进行
    let pending = false;

    const nextNodeKeys = [];
    const length = nodeKeys.length;

    // 遍历已有nodeKeys
    for (let i = 0; i < length; i++) {
      const k = nodeKeys[i];
      // 根据key获取对应的ANode对象
      const n = nodeHash[k];

      // 判断是否正在进行动画
      const isTransitioning = n.isTransitioning();
      // 初次进入页面后是false
      // console.log('isTransitioning, ', isTransitioning);
      if (isTransitioning) {
        pending = true;
      }

      if (n.type === LEAVE && !isTransitioning) {
        delete nodeHash[k];
      } else {
        nextNodeKeys.push(k);
      }
    }

    // 若动画未进行，则停止执行animate()
    if (!pending) {
      // console.log('====NG animate() stop');
      this.interval.stop();
    }

    // 若动画正在进行，则更新state，会再次触发render
    this.setState(() => ({
      nodeKeys: nextNodeKeys,
      nodes: nextNodeKeys.map(key => {
        return nodeHash[key];
      }),
    }));

    // console.log('====NG-animate()-finished');
  };

  render() {
    console.log('====props4 NodeGroup');
    // console.log(this.props);
    // console.log(this.state.nodes);
    // console.log(this.state.nodes[0].state);

    const renderedChildren = this.props.children(this.state.nodes);
    return renderedChildren && React.Children.only(renderedChildren);
  }
}

export default NodeGroup;
