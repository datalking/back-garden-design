# bg-design-tokens

> design tokens for `back-garden-**` design system

## Usage

- This package contains ui design values for `back-garden-**` design system, including typography, color palettes, spacing, borders, shadows and transitions.
- You can use the values by directly importing this package.
- It's recommended to define a theme with values picked from these design tokens first. And then use the theme in components. That's how `back-garden-react` does.
- Design tokens is implemented as js objects using TypeScript. It's possible to reuse them for multiple platforms (web, iOS, Android, etc.).

```sh
yarn add bg-design-tokens
```

```js
import React from 'react';
// import all tokens as an object
import tokens from 'bg-design-tokens';
// Or only import needed token:
// import { spacing } from 'bg-design-tokens';

const styles = {
  padding: tokens.spacing.scale['spacing-2'],
  // padding: spacing.scale['spacing-2'],
};

const BgComponent = () => <div style={styles}>Back Garden Component</div>;

export default BgComponent;
```

## Typography

- font-face
- font-size

## Colors

- main color palettes

## Spacing

- margin
- padding

## Borders

- circle

## Shadows

- outer
- inner

## Transitions

- duration

## Dependencies

- polished

## License

Licensed under [MIT](https://choosealicense.com/licenses/mit/) [License](/LICENSE).
