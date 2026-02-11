import Image from 'next/image';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
} from '../../ui/sidebar';
import { Balloon, CircleUser, Home, MessageSquareText } from 'lucide-react';
import SidebarMenuItem from './SidebarMenuItem';
import LogoutBtn from './LogoutBtn';
export default function AppSideBar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Image
          src="/logo.svg"
          alt=""
          width={80}
          height={80}
          className="mx-auto"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-4">
              <SidebarMenuItem icon={<Home />} title="Home" href="/" />
              <SidebarMenuItem icon={<CircleUser />} title="My" href="/" />
              <SidebarMenuItem icon={<Balloon />} title="Quiz" href="/" />
              <SidebarMenuItem
                icon={<MessageSquareText />}
                title="Review"
                href="/"
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <LogoutBtn />
      </SidebarFooter>
    </Sidebar>
  );
}
