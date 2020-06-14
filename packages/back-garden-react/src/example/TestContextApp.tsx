import React from 'react';
// import { ThemeProvider } from 'styled-components';
import { withLocaleConsumer, LocaleProvider } from '../components/foundation/locale';
import { SimpleSearch } from '..';
import * as zhCN from '../components/foundation/locale/lang/zh-CN';
import * as enUS from '../components/foundation/locale/lang/en-US';

const bulmaTheme = {
  themeName: 'bulma',
  color: {
    primary: 'coral',
    background: 'lightyellow',
  },
  borderRadius: '3',
};

interface ThemeContextValType {
  themeName: string;
  toggleTheme: any;
}
interface LocaleContextValType {
  localeName: string;
  toggleLocale: any;
  localeLang: any;
}

interface TestContextValType {
  themeContextVal: ThemeContextValType;
  localeContextVal: LocaleContextValType;
}

const TestThemeContext = React.createContext({
  themeName: 'light',
  toggleTheme: () => {},
});

const withThemeConsumer = WrappedComponent => {
  const Component = props => (
    <TestThemeContext.Consumer>
      {value => {
        const contextProps = value;
        return <WrappedComponent {...contextProps} />;
      }}
    </TestThemeContext.Consumer>
  );
  Component.displayName = `ThemeConsumer1(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return Component;
};
/**
 * 用来给子组件添加theme的组件
 */
class TestThemeConsumer extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <TestThemeContext.Consumer>
        {themes =>
          // ( <div></div>)
          // 写成下面这样能运行，但编译时会有类型异常
          // children(themes)
          (children as (props: any) => React.ReactNode)(themes)
        }
      </TestThemeContext.Consumer>
    );
  }
}

const PlainButton = (props: ThemeContextValType) => (
  <button
    style={{
      backgroundColor: props.themeName === 'light' ? 'lightyellow' : 'darkcyan',
      border: 'none',
      width: '24%',
      height: '48px',
    }}
    onClick={props.toggleTheme}
  >
    切换主题Theme
  </button>
);

// s1.基于普通context-consumer实现主题切换
const ThemedButton = () => (
  <TestThemeContext.Consumer>{(theme: ThemeContextValType) => <PlainButton {...theme} />}</TestThemeContext.Consumer>
);

// s2.基于高阶组件hoc实现主题切换
const ThemedButton2 = withThemeConsumer(PlainButton);

// s3.基于render props实现主题切换
const ThemedButton3 = () => <TestThemeConsumer>{theme => <PlainButton {...theme} />}</TestThemeConsumer>;

// s4.基于render props实现主题切换，提升内容到函数避免重新渲染
class ThemedButton4 extends React.Component {
  renderThemed = theme => <PlainButton {...theme} />;

  render() {
    return <TestThemeConsumer>{this.renderThemed}</TestThemeConsumer>;
  }
}

// const Toolbar = () => <ThemedButton />;
// const Toolbar = () => <ThemedButton2 />;
const Toolbar = () => <ThemedButton3 />;

const LocaledSearch = withLocaleConsumer(SimpleSearch);

export class TestContextApp extends React.Component<{}, TestContextValType> {
  // constructor(props) {
  //   super(props);
  // }

  toggleTheme = () => {
    this.setState((state: TestContextValType) => ({
      ...state,
      themeContextVal: {
        themeName: state.themeContextVal.themeName === 'light' ? 'dark' : 'light',
        toggleTheme: state.themeContextVal.toggleTheme,
      },
    }));
  };

  toggleLocale = () => {
    this.setState((state: TestContextValType) => ({
      ...state,
      localeContextVal: {
        localeName: state.localeContextVal.localeName === 'zh' ? 'en' : 'zh',
        localeLang: state.localeContextVal.localeName === 'zh' ? enUS : zhCN,
        toggleLocale: state.localeContextVal.toggleLocale,
      },
    }));
  };

  state = {
    themeContextVal: {
      themeName: 'light',
      toggleTheme: this.toggleTheme,
    },
    localeContextVal: {
      localeName: 'zh',
      toggleLocale: this.toggleLocale,
      localeLang: zhCN,
    },
  };

  render() {
    return (
      <TestThemeContext.Provider value={this.state.themeContextVal}>
        <LocaleProvider value={this.state.localeContextVal}>
          <h2> 基于react context切换主题 </h2>
          <Toolbar />

          <h2> 基于react context切换语言</h2>
          <LocaledSearch />

          <h2> 基于styled-components提供的ThemeProvider实现主题</h2>
          {/* <ThemeProvider theme={bulmaTheme}>
            <TestStyledButton>S-C的ThemeProvider</TestStyledButton>
          </ThemeProvider> */}
        </LocaleProvider>
      </TestThemeContext.Provider>
    );
  }
}
