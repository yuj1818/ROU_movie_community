import { Search } from 'lucide-react';

export default function SearchInput() {
  return (
    <div className="border border-gray-200 rounded-full py-2 px-3 flex items-center gap-4">
      <input
        type="text"
        className="w-30 outline-none border-none text-sm text-white"
      />
      <Search size="1rem" className="text-gray-200 cursor-pointer" />
    </div>
  );
}
