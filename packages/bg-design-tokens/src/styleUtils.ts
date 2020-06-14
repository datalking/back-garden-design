/**
 * 将px转换成rem
 * @param value px值
 * @param param1 换算参数，包括基数、小数位数
 */
const pxToRem = (value: number, { base = 16, decimals = 5 } = {}) => {
  if (value === 0) {
    return '0';
  }

  const result = parseFloat((value / base).toFixed(decimals));
  return `${result}rem`;
};

/**
 *
 * @param size
 */
const cssUnitFromSize = (size: string) => size.replace(/.+?([^\d]+$)/, '$1');

export { pxToRem, cssUnitFromSize };
