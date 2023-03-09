import '../styles/globals.css'
import type { AppProps } from 'next/app';
import { ConnectionProvider } from '@/context/connection';
import { TableContext, TableProvider } from '@/context/table';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ConnectionProvider>
        <TableProvider>
          <div className="text-gray-700 font-sans antialiased font-normal"><Component {...pageProps} /></div>
        </TableProvider>
      </ConnectionProvider>
    </>
  )
}



