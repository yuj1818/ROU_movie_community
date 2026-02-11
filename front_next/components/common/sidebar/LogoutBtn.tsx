'use client';

import { SidebarMenuButton } from '@/components/ui/sidebar';
import { logout } from '@/lib/auth';
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
    <SidebarMenuButton onClick={onClickLogout}>
      <LogOut />
    </SidebarMenuButton>
  );
}
