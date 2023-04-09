import '../styles/globals.css'
import type { AppProps } from 'next/app';
import { ConnectionProvider } from '@/context/connection';
import { NotificationProvider } from '@/context/notification';
import dynamic from 'next/dynamic';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NotificationProvider>
      <ConnectionProvider>
          <div className="text-primary antialiased min-h-screen bg-primary">
            <Component {...pageProps} />
          </div>
      </ConnectionProvider>
    </NotificationProvider>
    </>
  )
}

export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
});

