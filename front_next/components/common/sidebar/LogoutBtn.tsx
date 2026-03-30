'use client';

import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { logout } from '@/lib/client/auth';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

export default function LogoutBtn() {
  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => signOut(),
  });

  return (
    <SidebarMenuItem onClick={() => mutation.mutate()}>
      <SidebarMenuButton asChild tooltip="Logout" disabled={mutation.isPending}>
        <div>
          <LogOut />
          <span className="font-display text-xs">Logout</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
