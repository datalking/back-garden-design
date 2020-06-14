import { RGBColor } from './RGBColor';

/**
 * description of hsl color
 */
export class HSLColor {
  // color value as hsl
  hue: number;
  saturation: number;
  lightness: number;
  alpha: number;

  constructor(hue: number, saturation: number, lightness: number, alpha?: number) {
    this.hue = hue;
    this.saturation = saturation;
    this.lightness = lightness;
    this.alpha = alpha || 1;
  }

  /**
   * convert rgb to hsl
   * @param color rgb
   */
  static FromRGB(color: RGBColor) {
    const red = color.red / 255;
    const green = color.green / 255;
    const blue = color.blue / 255;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const lightness = (max + min) / 2;

    if (max === min) {
      // achromatic
      return new HSLColor(0, 0, lightness, color.alpha);
    }

    let hue;
    const delta = max - min;
    const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    switch (max) {
      case red:
        hue = (green - blue) / delta + (green < blue ? 6 : 0);
        break;
      case green:
        hue = (blue - red) / delta + 2;
        break;
      default:
        // blue case
        hue = (red - green) / delta + 4;
        break;
    }

    hue *= 60;
    return new HSLColor(hue, saturation, lightness, color.alpha);
  }

  toString(): string {
    if (this.alpha === 1) {
      return `hsl(${this.hue}, ${Math.round(this.saturation * 100)}%, ${Math.round(this.lightness * 100)}%)`;
    } else {
      return `hsla(${this.hue}, ${Math.round(this.saturation * 100)}%, ${Math.round(this.lightness * 100)}%, ${
        this.alpha
      })`;
    }
  }
}
