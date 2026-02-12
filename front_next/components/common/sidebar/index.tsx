import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
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
import {
  Balloon,
  CircleUser,
  Home,
  MessageSquareText,
  LogIn,
} from 'lucide-react';
import SidebarMenuItem from './SidebarMenuItem';
import LogoutBtn from './LogoutBtn';

export default async function AppSideBar() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session;

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
              <SidebarMenuItem
                icon={<MessageSquareText />}
                title="Review"
                href="/"
              />
              {isLoggedIn && (
                <>
                  <SidebarMenuItem
                    icon={<CircleUser />}
                    title="My"
                    href={`/profile/${session.user.id}`}
                  />
                  <SidebarMenuItem icon={<Balloon />} title="Quiz" href="/" />
                </>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu></SidebarMenu>
        {isLoggedIn ? (
          <LogoutBtn />
        ) : (
          <SidebarMenuItem icon={<LogIn />} title="Login" href="/login" />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
