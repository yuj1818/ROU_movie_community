'use client';

import { CircleX, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchInput() {
  const [keyword, setKeyword] = useState('');
  const router = useRouter();

  const onSearch = () => {
    if (keyword.trim()) {
      router.push(`/search?q=${keyword}`);
      setKeyword('');
    }
  };

  return (
    <div className="border border-gray-200 rounded-full py-1.5 px-3 flex items-center gap-2 w-50">
      <Search
        className="size-4 text-gray-200 cursor-pointer"
        onClick={onSearch}
      />
      <input
        type="text"
        className="w-30 outline-none border-none text-sm text-white"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="검색어를 입력해주세요"
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSearch();
        }}
      />
      {keyword.length > 0 && (
        <CircleX
          className="size-4.5 text-gray-200 cursor-pointer"
          onClick={() => setKeyword('')}
        />
      )}
    </div>
  );
}
