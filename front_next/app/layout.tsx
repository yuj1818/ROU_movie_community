import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSideBar from '@/components/common/sidebar';

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
        className={`${pretendard.variable} ${partialsans.variable} antialiased bg-black fixed inset-0 overflow-hidden dark`}
      >
        <SidebarProvider defaultOpen={false}>
          <AppSideBar />
          <main>
            <SidebarTrigger />
            {children}
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
