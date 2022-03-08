import { SessionProvider as NextSessionProvider } from 'next-auth/react';
import { AppProps } from 'next/app';
import { Header } from '../components/Header';

import { PrismicProvider } from '@prismicio/react';
import { client } from '../services/prismic';

import '../styles/global.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextSessionProvider session={pageProps.session}>
      <PrismicProvider client={client}>
        <Header />
        <Component {...pageProps} />
      </PrismicProvider>
    </NextSessionProvider>
  );
}

export default MyApp;
