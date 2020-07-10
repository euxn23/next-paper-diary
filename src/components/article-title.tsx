import React from 'react';
import dayjs from 'dayjs';
import { monthNames } from '../helper/month-names';
import { normalizePaperTitle } from '../helper';
import { parseTitle } from '../helper/perser';
import { CategoryTag } from './category-tag';

type Props = {
  entry: DropboxTypes.files.FileMetadataReference;
  year: number;
};

const colors = [
  'bg-red-300',
  'bg-orange-300',
  'bg-yellow-300',
  'bg-green-300',
  'bg-blue-300',
  'bg-indigo-300',
  'bg-purple-300',
];

export function ArticleTitle({ entry, year }: Props) {
  const titleObject = parseTitle(normalizePaperTitle(entry.name));
  const { title, date: mmdd, meta } = titleObject;
  const postedAt = dayjs(`${year}${mmdd || '0101'}`);

  const monthName = monthNames[postedAt.month()];
  const date = postedAt.date();
  const day = postedAt.day();
  const dateColor = colors[day % 7];

  return (
    <div className="flex shadow rounded-lg w-full bg-white m-2 relative">
      <div
        className={`${dateColor} rounded-lg lg:w-2/12 py-4 block h-full shadow-inner`}
      >
        <div className="text-center tracking-wide">
          <div className="text-white font-bold text-4xl">{date}</div>
          <div className="text-white font-normal text-2xl">{monthName}</div>
        </div>
      </div>
      <div className="w-full m-auto tracking-wide">
        <div className="font-semibold text-gray-800 text-xl text-center lg:text-left px-2">
          {title}
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: '1em', right: '1em' }}>
        {meta &&
          meta.tags &&
          meta.tags.map((tag: string, idx: number) => (
            <CategoryTag key={idx} tag={tag} />
          ))}
      </div>
    </div>
  );
}
