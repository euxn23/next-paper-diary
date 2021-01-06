import React from 'react';
import { Dropbox, files as DropboxFiles } from 'dropbox';
import fetch from 'isomorphic-unfetch';
import { GetStaticProps } from 'next';
import { ArticleTitle } from '../components/article-title';
import { entryFilter } from '../helper';
import Head from 'next/head';
import { appImage, appTitle, hostname } from '../constants';

type Entry = {
  entry: DropboxFiles.FileMetadataReference;
};

type Props = {
  entries: Entry[];
};

export default function Index({ entries }: Props) {
  return (
    <>
      <Head>
        <title>{appTitle}</title>
        <meta property='og:title' content={appTitle} />
        <meta name='keywords' content='javascript, nodejs, react, nextjs' />
        <meta property='og:type' content='blog' />
        <meta property='og:url' content={hostname} />
        <meta property='og:image' content={appImage} />
        <meta property='og:site_name' content={appTitle} />
        <meta name='twitter:card' content='summary' />
        <meta name='twitter:site' content='@euxn23' />
        <meta name='twitter:url' content={hostname} />
        <meta name='twitter:title' content={appTitle} />
        <meta name='twitter:description' content={appTitle} />
        <meta name='twitter:image' content={appImage} />
        <link rel='canonical' href={hostname} />
      </Head>
      <div>
        {entries.map(({ entry }) => (
          <div key={entry.content_hash}>
            <a href={`/${entry.id.replace('id:', '')}`}>
              <ArticleTitle entry={entry} />
            </a>
          </div>
        ))}
      </div>
    </>
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

  return { props: { entries }, revalidate: 60 };
};
