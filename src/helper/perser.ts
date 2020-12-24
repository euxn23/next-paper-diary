import { TitleObject } from '../types';

const dateRegExp = /\[(\d*)(?:\s#.*)?]\s?/
const tagRegExp = /\s?#([^\s#\]]*)/g
const appTitle = process.env.APP_TITLE ?? ''

// [yyyyMMdd #hash #tags] title
export function parseTitle(titleText?: string): TitleObject {
  if (!titleText)
    return {
      title: '',
      appTitle: '',
      date: '',
      meta: {}
    };
  const dateMatch = titleText.match(dateRegExp);
  const date = dateMatch ? dateMatch[1] : '';

  const title = titleText.replace(dateRegExp, '').replace(tagRegExp, '');

  const tags = [];
  for (const match of titleText.matchAll(tagRegExp)) {
    tags.push(match[1]);
  }

  return {
    title,
    appTitle,
    date,
    meta: {
      tags
    }
  };
}
