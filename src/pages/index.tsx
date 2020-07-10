import React from 'react';
import { Dropbox } from 'dropbox';
import fetch from 'isomorphic-unfetch';
import { GetStaticProps } from 'next';
import { ArticleTitle } from '../components/article-title';
import { entryFilter } from '../helper';

type Entry = {
  year: number;
  entry: DropboxTypes.files.FileMetadataReference;
};

type Props = {
  entries: Entry[];
  title: string;
};

export default function Index({ entries }: Props) {
  return (
    <div>
      {entries.map(({ entry, year }) => (
        <div key={entry.content_hash}>
          <a href={`/${entry.id.replace('id:', '')}`}>
            <ArticleTitle entry={entry} year={year} />
          </a>
        </div>
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const { DROPBOX_TOKEN, ARTICLE_PATH } = process.env;
  if (!DROPBOX_TOKEN || !ARTICLE_PATH) {
    throw new Error('$DROPBOX_TOKEN and $ARTICLE_PATH is required.');
  }

  const dbx = new Dropbox({ accessToken: process.env.DROPBOX_TOKEN, fetch });
  const years = [2020];
  const entries = await years
    .sort((p, n) => (p < n ? 1 : -1))
    .reduce<Promise<Entry[]>>(async (prevEntriesPromise, year) => {
      const currentEntries = await dbx
        .filesListFolder({
          path: `/${ARTICLE_PATH}/${year}`,
        })
        .then(({ entries }) =>
          entries
            .filter(entryFilter)
            .sort((p, n) => (p.name < n.name ? 1 : -1))
            .map((entry) => ({ entry, year }))
        );
      const prevEntries = await prevEntriesPromise;
      return [...currentEntries, ...prevEntries];
    }, Promise.resolve([]));
  const title = process.env.APP_TITLE || '';

  return { props: { entries, title } };
};
