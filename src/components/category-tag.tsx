import React from 'react';
import { tagColors } from '../helper/tag-colors';

type Props = {
  tag: string;
};

export function CategoryTag({ tag }: Props) {
  const color = tagColors[tag] || 'bg-gray-500 text-white';
  console.log(tagColors[tag])
  return <span className={`mx-1 px-2 py-1 ${color}`}>{tag}</span>;
}
