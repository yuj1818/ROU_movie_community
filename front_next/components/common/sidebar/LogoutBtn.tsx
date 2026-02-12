'use client';

import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { logout } from '@/lib/client/auth';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function LogoutBtn() {
  const onClickLogout = async () => {
    const res = await logout();
    if (res.status === 200) {
      signOut();
    }
  };

  return (
    <SidebarMenuItem onClick={onClickLogout}>
      <SidebarMenuButton asChild tooltip="Logout">
        <LogOut />
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
