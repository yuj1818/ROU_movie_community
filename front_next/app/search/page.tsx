import SearchList from '@/components/search/SearchList';
import { searchMovie } from '@/lib/movie';
import { Suspense } from 'react';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  if (!q?.trim()) {
    return (
      <div className="py-12 w-full text-center text-xl font-semibold">
        검색어를 입력해주세요
      </div>
    );
  }

  const results = await searchMovie(q);

  return (
    <Suspense key={q} fallback={<div>검색중...</div>}>
      <div className="w-4/5 flex flex-col gap-4 py-12">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-2xl">"{q}"</span>에 대한 검색 결과
          {results.length > 0 ? (
            <span className="text-sm">( {results.length} )</span>
          ) : (
            <span>가 없습니다.</span>
          )}
        </div>
        <SearchList results={results} />
      </div>
    </Suspense>
  );
}
