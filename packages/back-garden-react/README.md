# back-garden-react

> themeable react components for the web.

## features

- theme-based react components compatible with the [Theme Specification](https://system-ui.com/theme)
- better consistency with constraint-based [style prop](https://styled-system.com) functions
- easy to make components responsive with array-based values
- component APIs are closely related to APIs of [Ant Design](https://ant.design) components for migration
- misc
  - components styled with css-in-js, using api compatible with both styled-components and emotion
  - support component variants

## Quickstart

- install

```
yarn add back-garden-react
```

- use components

```javascript
import React from 'react';
import { Button } from 'back-garden-react';

export default () => <Button color='primary'>My Bulma button</Button>;
```

- read the [docs]()

## dependencies

- [react/MIT](https://github.com/facebook/react)
  - ui component = f(data)
  - `context` based locale and theme switcher
- [styled-components/MIT](https://github.com/styled-components/styled-components)
  - popular css-in-js solution
- [bulma/MIT](https://github.com/jgthms/bulma)
  - stylish css styles based on flexbox
- [svgr/MIT](https://github.com/smooth-code/svgr)
  - convert svg icons to react components
- [react-move/MIT](https://github.com/react-tools/react-move)
  - animate html and svg
- [react-draggable/MIT](https://github.com/mzabriskie/react-draggable)
  - drag support
- [react-resizable/MIT](https://github.com/STRML/react-resizable)
  - resize support
- references
  - [ant-design/MIT](https://github.com/ant-design/ant-design/)
    - an enterprise-class UI design language and React UI library
