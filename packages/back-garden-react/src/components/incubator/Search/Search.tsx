import React from 'react';
import { LocaleSearch } from '../../../primitive/locale/localeType';

interface SimpleSearchProps {
  Search: LocaleSearch;
  [propName: string]: any;
}

class SimpleSearch extends React.Component<SimpleSearchProps, {}> {
  render() {
    console.log('====props4SimpleSearch');
    console.log(this.props);
    const { search, clear } = this.props.localeLang.Search;
    const { toggleLocale } = this.props;
    return (
      <div>
        <input type='text' />
        <button>{search}</button>
        <button>{clear}</button>
        <button onClick={toggleLocale}>切换中英文</button>
      </div>
    );
  }
}

export default SimpleSearch;
