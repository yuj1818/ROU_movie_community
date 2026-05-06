'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ModalContext } from '@/contexts/ModalContext';
import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ModalContext>
          <SidebarProvider>{children}</SidebarProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </ModalContext>
      </QueryClientProvider>
    </SessionProvider>
  );
}
