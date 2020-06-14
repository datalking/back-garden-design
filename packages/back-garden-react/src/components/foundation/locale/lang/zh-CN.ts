import { LocaleCommon, LocalePop, LocaleSelect, LocaleSearch } from '../localeType';

const common: LocaleCommon = {
  confirm: '确定',
  cancel: '取消',
  ok: '知道了',
  search: '搜索',
  clear: '清除',
  reset: '重置',
  close: '关闭',
  pleaseSelect: '请选择',
  pleaseInput: '请输入',
};

export const Pop: LocalePop = {
  ...common,
};

export const Select: LocaleSelect = {
  input: '请选择',
  empty: '',
};

export const Search: LocaleSearch = {
  ...common,
};
