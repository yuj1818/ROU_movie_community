import { SidebarTrigger } from '@/components/ui/sidebar';
import SearchInput from './SearchInput';

export default function Header() {
  return (
    <div className="w-full py-4 pl-2 pr-4 flex items-center justify-between">
      <SidebarTrigger />
      <SearchInput />
    </div>
  );
}
