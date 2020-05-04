import React from 'react';
import { Dropbox } from 'dropbox';
import fetch from 'isomorphic-unfetch';
import { normalizePaperTitle } from '../helper';
import { GetStaticProps } from 'next';

type Props = {
  entries: DropboxTypes.files.FileMetadataReference[];
};

export default function Index({ entries }: Props) {
  return (
    <div>
      {entries.map((entry) => (
        <div key={entry.content_hash}>
          <a href={`/${entry.id.replace('id:', '')}`}>
            {normalizePaperTitle(entry.name)}
          </a>
        </div>
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const dbx = new Dropbox({ accessToken: process.env.DROPBOX_TOKEN, fetch });
  const { entries } = await dbx.filesListFolder({ path: '/_diary/2020' });

  return { props: { entries: entries.reverse() } };
}
