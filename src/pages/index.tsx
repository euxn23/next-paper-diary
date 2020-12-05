import React from 'react';
import { Dropbox, files as DropboxFiles } from 'dropbox';
import fetch from 'isomorphic-unfetch';
import { GetStaticProps } from 'next';
import { ArticleTitle } from '../components/article-title';
import { entryFilter } from '../helper';

type Entry = {
  entry: DropboxFiles.FileMetadataReference;
};

type Props = {
  entries: Entry[];
  title: string;
};

export default function Index({ entries }: Props) {
  return (
    <div>
      {entries.map(({ entry }) => (
        <div key={entry.content_hash}>
          <a href={`/${entry.id.replace('id:', '')}`}>
            <ArticleTitle entry={entry} />
          </a>
        </div>
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { DROPBOX_TOKEN } = process.env;
  if (!DROPBOX_TOKEN) {
    throw new Error('$DROPBOX_TOKEN is required.');
  }

  const dbx = new Dropbox({ accessToken: process.env.DROPBOX_TOKEN, fetch });
  const entries = await dbx
    .filesListFolder({
      path: ``
    })
    .then(({ result }) =>
      result.entries
        .filter(entryFilter)
        .sort((p, n) => (p.name < n.name ? 1 : -1))
        .map((entry) => ({ entry }))
    );
  const title = process.env.APP_TITLE || '';

  return { props: { entries, title } };
};
