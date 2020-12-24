import React from 'react';
import { tagColors } from '../helper/tag-colors';

type Props = {
  tag: string;
};

export function CategoryTag({ tag }: Props) {
  const color = tagColors[tag] || 'bg-gray-500 text-white';
  return <span className={`rounded-lg mx-1 my-1 px-4 py-1 ${color}`}>{tag}</span>;
}
