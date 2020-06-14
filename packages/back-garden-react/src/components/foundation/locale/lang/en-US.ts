import { LocaleCommon, LocalePop, LocaleSelect, LocaleSearch } from '../localeType';

const common: LocaleCommon = {
  confirm: 'Confirm',
  cancel: 'Cancel',
  ok: 'OK',
  search: 'Search',
  clear: 'Clear',
  reset: 'Reset',
  close: 'Close',
  pleaseSelect: 'please select one',
  pleaseInput: 'please input ',
};

export const Pop: LocalePop = {
  ...common,
};

export const Select: LocaleSelect = {
  input: 'Please choose',
  empty: '',
};

export const Search: LocaleSearch = {
  ...common,
};
