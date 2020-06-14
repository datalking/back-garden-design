import React from 'react';

import * as defaultLocale from './lang/default';

interface LocaleProviderProps {
  localeName?: string;
  localeLang?: any;
  localeToggle?: any;
}

const defaultLocaleContext: LocaleProviderProps = {
  localeName: 'zh',
  localeLang: defaultLocale,
  // localeToggle: () => {},
};

const LocaleContext = React.createContext(defaultLocaleContext);

const { Provider: LocaleProvider, Consumer: LocaleConsumer } = LocaleContext;

// class LocaleReceiver extends React.Component {
//   // 设置contextType属性后，就可以在各生命周期函数中直接使用this.context
//   // static contextType = LocaleContext;
// }

const withLocaleConsumer = WrappedComponent => {
  const Component = props => (
    <LocaleContext.Consumer>
      {value => {
        const contextProps = value;
        return <WrappedComponent {...contextProps} />;
      }}
    </LocaleContext.Consumer>
  );
  Component.displayName = `LocaleConsumer1(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return Component;
};

export { LocaleContext, LocaleProvider, LocaleConsumer, withLocaleConsumer };
