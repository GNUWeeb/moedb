import '../styles/globals.css'
import type { AppProps } from 'next/app';
import { ConnectionProvider } from '@/context/connection';
import { TableProvider } from '@/context/table';
import { NotificationProvider } from '@/context/notification';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <NotificationProvider>
      <ConnectionProvider>
        <TableProvider>
          <div className="text-primary antialiased min-h-screen bg-primary">
            <Component {...pageProps} />
          </div>
        </TableProvider>
      </ConnectionProvider>
    </NotificationProvider>
    </>
  )
}



