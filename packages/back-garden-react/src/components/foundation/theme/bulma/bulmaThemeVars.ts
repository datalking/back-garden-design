import getDerivedVariables from './utilities/derivedVariables';
import { buttonDesignTokens } from '../../../general/Button/buttonDesignTokens';

class VarCalculator {
  static _variables = {};
  static _defaults = [];
  static _derived = [];

  static getVariables = overrides =>
    VarCalculator._derived.reduce(
      (accVars, calcCompStyle) => ({
        ...calcCompStyle(accVars),
        ...accVars,
      }),
      getDerivedVariables(overrides),
    );

  static addDefault(obj) {
    VarCalculator._defaults.push(obj);
  }

  static addDerivedDefault(value) {
    if (typeof value === 'function') {
      VarCalculator._derived.push(value);
    }
  }
}

// style vars for button
VarCalculator.addDerivedDefault(buttonDesignTokens);

export const addBulmaThemeVars = themeObj => VarCalculator.getVariables(themeObj);
