import React from 'react';
import dayjs from 'dayjs';
import { monthNames } from '../helper/month-names';
import { normalizePaperTitle } from '../helper';
import { parseTitle } from '../helper/perser';
import { CategoryTag } from './category-tag';
import { files } from 'dropbox';

type Props = {
  entry: files.FileMetadataReference;
};

const colors = [
  'bg-red-300',
  'bg-orange-300',
  'bg-yellow-300',
  'bg-green-300',
  'bg-blue-300',
  'bg-indigo-300',
  'bg-purple-300'
];

export function ArticleTitle({ entry }: Props) {
  const titleObject = parseTitle(normalizePaperTitle(entry.name));
  const { title, date: yyyymmdd, meta } = titleObject;
  const postedAt = dayjs(`${yyyymmdd || '20200101'}`);

  const monthName = monthNames[postedAt.month()];
  const date = postedAt.date();
  const day = postedAt.day();
  const dateColor = colors[day % 7];

  return (
    <div className='flex w-full shadow rounded bg-white m-2 relative'>
      <div className='flex w-1/6'>
        <div
          className={`flex justify-around w-full ${dateColor} rounded-sm py-4 block shadow-inner`}
        >
          <div className='text-center tracking-wide'>
            <div className='text-white font-bold text-4xl'>{date}</div>
            <div className='text-white font-normal text-2xl'>{monthName}</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between w-5/6 p-2">
        <div className='flex justify-start w-full m-auto tracking-wide'>
          <div className='font-semibold text-gray-800 text-xl text-center lg:text-left px-2'>
            {title}
          </div>
        </div>
        <div className='flex justify-end'>
          {meta &&
          meta.tags &&
          meta.tags.map((tag: string, idx: number) => (
            <CategoryTag key={idx} tag={tag} />
          ))}
        </div>
      </div>
    </div>
  );
}
