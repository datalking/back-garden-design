import { guard } from './guard';
import { RGBColor } from './RGBColor';
import { HSLColor } from './HSLColor';

function darken(amount: number, color: string): string {
  if (color === 'transparent') {
    return color;
  }
  const rgbColor: RGBColor = RGBColor.FromString(color);
  const hslColor: HSLColor = HSLColor.FromRGB(rgbColor);
  hslColor.lightness = guard(0, 1, hslColor.lightness - amount);
  return RGBColor.FromHsl(hslColor).toString();
}

export { darken };
