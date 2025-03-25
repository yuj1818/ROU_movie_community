import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { searchMovie } from '../utils/movieApi';
import SearchList from '../components/search/SearchList';

const SearchPage = () => {
  const [searchData, setSearchData] = useState([]);
  const [query, setQuery] = useState();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const getSearchData = async () => {
      const q = searchParams.get('q');
      const res = await searchMovie({ q: q });
      setQuery(q);
      setSearchData(res);
    };

    getSearchData();
  }, [location.search]);

  return (
    query && (
      <div className="w-4/5 flex flex-col gap-8 text-white py-12 h-fit">
        <div className="flex items-end">
          <p className="font-pretendard_semibold text-2xl">"{query}"</p>
          <p className="text-md">에 대한 검색 결과</p>
          {searchData.length > 0 ? (
            <p className="text-sm ml-2">({searchData.length})</p>
          ) : (
            <p className="text-md">가 없습니다.</p>
          )}
        </div>
        {searchData && <SearchList searchData={searchData} />}
      </div>
    )
  );
};

export default SearchPage;
