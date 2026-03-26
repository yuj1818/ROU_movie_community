import {
  SidebarMenuItem as MenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface SidebarMenuProps {
  icon: LucideIcon;
  title: string;
  href: string;
}

export default function SidebarMenuItem({
  icon: Icon,
  title,
  href,
}: SidebarMenuProps) {
  return (
    <MenuItem>
      <SidebarMenuButton asChild tooltip={title}>
        <Link href={href}>
          <Icon />
          <span className="font-display">{title}</span>
        </Link>
      </SidebarMenuButton>
    </MenuItem>
  );
}
