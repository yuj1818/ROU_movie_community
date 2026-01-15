import {
  SidebarMenuItem as MenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import Link from 'next/link';

interface SidebarMenuProps {
  icon: React.ReactNode;
  title: string;
  href: string;
}

export default function SidebarMenuItem({
  icon,
  title,
  href,
}: SidebarMenuProps) {
  return (
    <MenuItem>
      <SidebarMenuButton asChild tooltip={title}>
        <Link href={href}>
          {icon}
          <span className="font-display">{title}</span>
        </Link>
      </SidebarMenuButton>
    </MenuItem>
  );
}
