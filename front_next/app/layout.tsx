import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

import AppSideBar from '@/components/common/sidebar';
import Header from '@/components/common/header.tsx';
import Providers from '@/components/common/Providers';

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  weight: '100 900',
  display: 'swap',
  variable: '--font-pretendard',
});

const partialsans = localFont({
  src: '../fonts/PartialSansKR-Regular.woff2',
  weight: '400',
  display: 'swap',
  variable: '--font-partialsans',
});

export const metadata: Metadata = {
  title: 'ROU 영화 커뮤니티',
  description: '영화 정보와 후기를 공유하는 서비스',
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${pretendard.variable} ${partialsans.variable} antialiased bg-black w-screen h-screen overflow-hidden dark flex`}
      >
        <Providers>
          <AppSideBar />
          <main className="flex-1 min-w-0 h-full flex flex-col">
            <Header />
            <div className="flex-1 min-h-0 overflow-y-auto w-full">
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
