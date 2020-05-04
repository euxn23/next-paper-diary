import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { Dropbox } from 'dropbox';
import fetch from 'isomorphic-unfetch';
import { JSDOM } from 'jsdom'
import { entryFilter, normalizeDropboxId } from '../helper';

type Props = { __html: string };

export default function Entry({ __html }: Props) {
  return <div dangerouslySetInnerHTML={{ __html }} />;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const dbx = new Dropbox({ accessToken: process.env.DROPBOX_TOKEN, fetch });
  const { entries } = await dbx.filesListFolder({ path: '/_diary/2020' });

  return {
    paths: entries
      .filter(entryFilter)
      .map((entry) => `/${normalizeDropboxId(entry.id)}`),
    fallback: false,
  };
};

type StaticProps = {
  id: string;
};
export const getStaticProps: GetStaticProps<{}, StaticProps> = async (
  context
) => {
  const entryId = context.params?.id;
  if (!entryId) {
    throw new Error();
  }

  const dbx = new Dropbox({ accessToken: process.env.DROPBOX_TOKEN, fetch });
  const { entries } = await dbx.filesListFolder({ path: '/_diary/2020' });
  const entry = entries
    .filter(entryFilter)
    .find((e) => normalizeDropboxId(e.id) === entryId);
  if (!entry?.path_display) {
    throw new Error();
  }

  const metadata = await dbx.filesExport({
    path: entry.path_display,
  });
  const buf: Buffer = (metadata as any).fileBinary;

  const { window } = new JSDOM(buf.toString())
  const __html = window.document.querySelector('html')!.innerHTML

  return { props: { __html } };
};
