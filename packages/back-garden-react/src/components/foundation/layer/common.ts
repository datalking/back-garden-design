/**
 * 判断输入值是否为基本类型，如Object(1)===1返回false
 */
export function isPrimitiveType(value: any): boolean {
  return Object(value) !== value;
}
