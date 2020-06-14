import { pxToRem } from './styleUtils';

// todo change base to 2^N
const base = 6;
const multipliers = Array.from({ length: 11 }, (_, index) => index);
const scale = multipliers.reduce((obj: Record<string, string | number>, scaleNum) => {
  const value = pxToRem(scaleNum * base);
  obj[`spacing-${scaleNum}`] = scaleNum === 0 ? 0 : value;
  return obj;
}, {});

export { base, multipliers, scale };
