// 本文件全部是接口，定义了需要国际化的组件相关的属性

export interface LocaleCommon {
  confirm?: string;
  cancel?: string;
  ok?: string;
  search?: string;
  clear?: string;
  reset?: string;
  close?: string;
  pleaseSelect?: string;
  pleaseInput?: string;
}

export interface LocalePop extends LocaleCommon {}

export interface LocaleSelect {
  input: string;
  empty?: string;
}

export interface LocaleSearch extends LocaleCommon {}
