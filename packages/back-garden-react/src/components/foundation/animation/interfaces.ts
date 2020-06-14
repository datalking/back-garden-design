type GetInterpolator = (begValue?: any, endValue?: any, attr?: string, namespace?: string) => (t: number) => any;

interface HashMap {
  [key: string]: any;
}

/** Animate组件的props类型 */
export interface AnimateProps {
  /** child是否要被render，默认true */
  show?: boolean;
  /** 插值函数，根据初始值、终点值、属性和namespace返回一个插值函数，默认返回的是线性插值函数 */
  interpolation?: GetInterpolator;
  /** 一个对象或函数，函数会返回代表初始state的对象 */
  start: any;
  /** An object, array of objects, or 返回对象或对象数组的函数，描述在enter状态时state应该如何transform  */
  enter?: any;
  /** An object, array of objects, or 返回对象或对象数组的函数，描述在update状态时state应该如何transform，
   * 尽管是非必需属性，但提供一个update方法来处理enter和leave状态的中断会更好
   */
  update?: any;
  /** An object, array of objects, or 返回对象或对象数组的函数，描述在leave状态时state应该如何transform */
  leave?: any;
  /** A function that receives the state */
  children: (state: HashMap) => React.ReactElement<any>;
}

/** NodeGroup组件的props类型 */
export interface NodeGroupProps {
  /** 以不可变数组表示的数据，节点只会在prev.data !== next.data的情况下更新 */
  data: Array<any>;
  /** 用来获取每个object的key的函数，根据数据和索引返回一个key，用来跟踪是哪些节点在entering, updating and leaving */
  keyAccessor: (data: any, index: number) => string | number;
  /** 函数，根据初始值、终点值、属性和namespace返回一个插值函数，默认返回的是线性插值函数 */
  interpolation?: GetInterpolator;
  /** 函数，根据数据和索引返回代表初始state的对象 */
  start: (data: any, index: number) => HashMap;
  /** 函数，根据数据和索引返回一个对象或对象数组，描述在enter状态时state应该如何transform */
  enter?: (data: any, index: number) => HashMap | Array<HashMap>;
  /** 函数，根据数据和索引返回一个对象或对象数组，描述在update状态时state应该如何transform */
  update?: (data: any, index: number) => HashMap | Array<HashMap>;
  /** 函数，根据数据和索引返回一个对象或对象数组，描述在leave状态时state应该如何transform */
  leave?: (data: any, index: number) => HashMap | Array<HashMap>;
  /** 函数，接收一组节点作为参数 */
  children: (nodes: Array<any>) => React.ReactElement<any>;
}
