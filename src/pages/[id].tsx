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
import { isMatchImageURL } from '../helper/is-match-image-url';
import ogs from 'open-graph-scraper';
import { buildOGPDOMString } from '../helper/build-ogp-domstring';

type Props = { html: string; titleObject: TitleObject };

export default function Entry({ html, titleObject: { title, date, meta } }: Props) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className='p-4 sm:p-8 w-full shadow-2xl'>
        <div className='flex justify-between'>
          <div className='h-auto flex flex-col justify-center'>
            <p>{date}</p>
          </div>
          <div className='flex justify-end m-1 flex-wrap'>
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

  const anchorDOMs = Array.from(body.querySelectorAll('a'));

  const imagesDOMs = anchorDOMs.filter((el) => isMatchImageURL(el.href));
  const urlDOMs = anchorDOMs.filter((el) => !isMatchImageURL(el.href))
    .filter((el) => {
      try {
        new URL(el.text);
        return true;
      } catch {
        return false;
      }
    });

  // replace image url to img tag
  imagesDOMs.forEach((el) => {
    const imgEl = window.document.createElement('img');
    imgEl.src = el.href;
    imgEl.className = 'w-64';
    el.replaceWith(imgEl);
  });

  // extend OGP
  await Promise.all(urlDOMs.map(async (el) => {
    const ogpResult = await ogs({ url: el.href, timeout: 3600 }).then((data) => data.error ? undefined : data.result);
    if (!ogpResult) {
      return;
    }

    const ogpDOMString = buildOGPDOMString(ogpResult);

    const ogpEl = new JSDOM(ogpDOMString).window.document.body;
    el.replaceWith(ogpEl);
  }));

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
