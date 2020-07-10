import React from 'react';
import { default as NextApp } from 'next/app';
import './style.scss';
import Head from 'next/head';

type Props = {
  title?: string;
};

export default class App extends NextApp<Props> {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <Head>
          <title>{this.props.title}</title>
        </Head>
        <div className="flex justify-center bg-gray-100 text-base sm:text-sm md:text-base lg:text-base xl:text-base">
          <div className="container w-full m-4" style={{ maxWidth: 1024}}>
            <Component {...pageProps} />
          </div>
        </div>
      </>
    );
  }
}
