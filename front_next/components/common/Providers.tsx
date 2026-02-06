'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ModalContext } from '@/contexts/ModalContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ModalContext>
        <SidebarProvider defaultOpen={false}>{children}</SidebarProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </ModalContext>
    </QueryClientProvider>
  );
}
