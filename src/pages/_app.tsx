import React from 'react';
import { default as NextApp } from 'next/app';
import './style.scss';
import Link from 'next/link';
import { appTitle, themeColor } from '../constants';

type Props = {
  title?: string;
};

export default class App extends NextApp<Props> {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <div className='min-h-screen'>
        <div className={`flex h-10 leading-10 w-full bg-${themeColor}`}>
          <Link href='/'><p className='ml-4 text-gray-500 leading-10 text-lg font-bold no-underline cursor-pointer'>{appTitle}</p></Link>
        </div>

        <div className='flex justify-center bg-gray-100 text-base sm:text-sm' style={{ minHeight: 'calc(100vh - 2.5rem)' }}>
          <div className='container w-full m-0 lg:m-4' style={{ maxWidth: 1024 }}>
            <Component {...pageProps} />
          </div>
        </div>
      </div>
    );
  }
}
