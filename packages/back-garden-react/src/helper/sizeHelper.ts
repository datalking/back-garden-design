// import { Size } from '../common/types';
/**
 * 17 size ratio
 */
export type Ratio =
  | 'minorSecond'
  | 'majorSecond'
  | 'minorThird'
  | 'majorThird'
  | 'perfectFourth'
  | 'augFourth'
  | 'perfectFifth'
  | 'minorSixth'
  | 'goldenSection'
  | 'majorSixth'
  | 'minorSeventh'
  | 'majorSeventh'
  | 'octave'
  | 'majorTenth'
  | 'majorEleventh'
  | 'majorTwelfth'
  | 'doubleOctave';

/**
 * convert ratio name to number
 * @param ratio
 */
function getRatioValue(ratio: Ratio): number {
  switch (ratio) {
    case 'minorSecond':
      return 1.067;
    case 'majorSecond':
      return 1.125;
    case 'minorThird':
      return 1.2;
    case 'majorThird':
      return 1.25;
    case 'perfectFourth':
      return 1.333;
    case 'augFourth':
      return 1.414;
    case 'perfectFifth':
      return 1.5;
    case 'minorSixth':
      return 1.6;
    case 'goldenSection':
      return 1.618;
    case 'majorSixth':
      return 1.667;
    case 'minorSeventh':
      return 1.778;
    case 'majorSeventh':
      return 1.875;
    case 'octave':
      return 2;
    case 'majorTenth':
      return 2.5;
    case 'majorEleventh':
      return 2.667;
    case 'majorTwelfth':
      return 3;
    case 'doubleOctave':
      return 4;
    default:
      return 1;
  }
}
/**
 * convert scale level to actual scale ratio
 * @param steps
 * @param base
 * @param ratio
 */
export function modularScale(steps: number, base: number, ratio: Ratio): number {
  if (base === 0) {
    base = 1;
  }
  const ratioValue = getRatioValue(ratio);
  return base * Math.pow(ratioValue, steps);
}
/**
 * convert a size name to a scale level
 * @param sizeName size name, if undefined, medium will be used
 */
function sizeToScale(sizeName: Size): number {
  const nameToScale = {
    mini: -3,
    tiny: -2,
    small: -1,
    medium: 0,
    large: 1,
    big: 2,
    huge: 3,
    massive: 4,
  };
  if (!sizeName) {
    sizeName = 'medium';
  }
  return nameToScale[sizeName];
}
/**
 * convert size name to ratio number
 * @param size source size name
 * @param base size in local units
 * @param ratio scale ratio
 */
export function scaleSize(size: Size, base: number, ratio: Ratio): number {
  return modularScale(sizeToScale(size), base, ratio);
}
