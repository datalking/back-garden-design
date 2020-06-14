import { getLuminance, rgba, setLightness, darken } from 'polished';

/** 从theme对象中获取属性值，类似于styled-system的themeGet */
export function fromTheme(key: string) {
  return (props: { theme: { [x: string]: any } }) => props.theme[key];
}

export function findColorInvert($color) {
  if (getLuminance($color) > 0.55) {
    return rgba('#000', 0.7);
  }
  return '#fff';
}

export function findLightColor($color) {
  let lightness = getLuminance($color);
  if (lightness < 0.96) {
    lightness = 0.96;
  }
  return setLightness(lightness, $color);
}

export function findDarkColor($color) {
  const lightness = getLuminance($color);
  return darken(0.2, $color);
}
