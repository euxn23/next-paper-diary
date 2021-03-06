import { TitleObject } from '../types';

const dateRegExp = /\[(\d*)(?:\s#.*)?]\s?/
const tagRegExp = /\s?#([^\s#\]]*)/g

// [yyyyMMdd #hash #tags] title
export function parseTitle(titleText?: string): TitleObject {
  if (!titleText)
    return {
      title: '',
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
    date,
    meta: {
      tags
    }
  };
}
