import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Dropbox } from 'dropbox';
import fetch from 'isomorphic-unfetch';
import { JSDOM } from 'jsdom';
import { entryFilter, normalizeDropboxId } from '../helper';
import Head from 'next/head';
import { parseTitle } from '../helper/perser';
import { TitleObject } from '../types';
import { CategoryTag } from '../components/category-tag';
import Interweave from 'interweave';

type Props = { html: string; titleObject: TitleObject };

export default function Entry({ html, titleObject: { title, date, meta } }: Props) {
  console.log(meta);
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className='p-8 w-full shadow-2xl'>
        <div className='flex justify-between'>
          <div className='h-auto flex flex-col justify-center'>
            <p>{date}</p>
          </div>
          <div className='flex justify-end m-1'>
            {meta &&
            meta.tags &&
            meta.tags.map((tag: string, idx: number) => (
              <CategoryTag key={idx} tag={tag} />
            ))}
          </div>
        </div>
        <Interweave content={html} />
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const dbx = new Dropbox({ accessToken: process.env.DROPBOX_TOKEN, fetch });
  const { result } = await dbx.filesListFolder({
    path: ''
  });

  return {
    paths: result.entries
      .filter(entryFilter)
      .map((entry) => `/${normalizeDropboxId(entry.id)}`),
    fallback: false
  };
};

type StaticProps = {
  id: string;
};
export const getStaticProps: GetStaticProps<Props, StaticProps> = async (
  context
) => {
  const entryId = context.params?.id;
  if (!entryId) {
    throw new Error();
  }

  const dbx = new Dropbox({ accessToken: process.env.DROPBOX_TOKEN, fetch });
  const { result } = await dbx.filesListFolder({ path: '' });
  const entry = result.entries
    .filter(entryFilter)
    .find((e) => normalizeDropboxId(e.id) === entryId);
  if (!entry?.path_display) {
    throw new Error();
  }

  const metadata = await dbx.filesExport({
    path: entry.path_display
  });
  const buf: Buffer = (metadata.result as any).fileBinary;

  const { window } = new JSDOM(buf.toString());
  const { body } = window.document;
  Array.from(body.querySelectorAll('a'))
    .filter((el) => el.href.match(/\.(jpeg|png)$/))
    .forEach((el) => {
      const imgEl = window.document.createElement('img');
      imgEl.src = el.href;
      imgEl.className = 'w-64';
      el.replaceWith(imgEl);
    });

  const titleDOM = body.querySelector('div.ace-line:first-child');
  const titleObject = parseTitle(titleDOM?.textContent || undefined);

  if (titleDOM) {
    titleDOM.textContent = titleObject.title;
  }

  const html = `\
<div>
${window.document.body.innerHTML}
</div>`;

  return { props: { html, titleObject } };
};
