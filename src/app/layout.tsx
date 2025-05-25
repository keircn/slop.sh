import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '~/components/Navbar';
import { NavbarProvider } from '~/context/NavbarContext';
import { AudioProvider } from '~/context/AudioContext';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL('https://slop.sh'),
    verification: {
      other: {
        'p:domain_verify': '700dfd4a3272bcb80e09f5f78060035c',
      },
    },
    title: 'Keiran',
    description: 'I make things',
    icons: {
      icon: [
        {
          url: '/favicon/favicon-16x16.png',
          sizes: '16x16',
          type: 'image/png',
        },
        {
          url: '/favicon/favicon-32x32.png',
          sizes: '32x32',
          type: 'image/png',
        },
        { url: '/favicon/favicon.ico', sizes: 'any' },
      ],
      apple: [
        {
          url: '/favicon/apple-touch-icon.png',
          sizes: '180x180',
          type: 'image/png',
        },
      ],
      other: [
        {
          rel: 'android-chrome',
          url: '/favicon/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          rel: 'android-chrome',
          url: '/favicon/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        { rel: 'manifest', url: '/favicon/site.webmanifest' },
      ],
    },
    openGraph: {
      title: 'Keiran',
      description: 'i make things',
      url: 'https://slop.sh',
      siteName: 'slop.sh',
      images: [
        {
          url: '/pfp.jpg',
          width: 460,
          height: 460,
          alt: 'brrr',
        },
      ],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning className='dark scroll-smooth'>
      <body
        className={`${inter.variable} isolate flex min-h-screen flex-col overflow-x-hidden font-sans antialiased`}
      >
        <NavbarProvider>
          <AudioProvider>
            <div className='relative z-0 flex flex-grow flex-col'>
              <Navbar />
              {children}
            </div>
          </AudioProvider>
        </NavbarProvider>
      </body>
    </html>
  );
}
