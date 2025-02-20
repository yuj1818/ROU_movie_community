import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { searchMovie } from '../../utils/movieApi';

const MovieSearchPage = () => {
  const [searchData, setSearchData] = useState([]);
  const [query, setQuery] = useState();
  const location = useLocation();

  useEffect(() => {
    const getSearchData = async () => {
      const q = new URLSearchParams(location.search).get('q');
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
            <p className="text-sm">({searchData.length})</p>
          ) : (
            <p className="text-md">가 없습니다.</p>
          )}
        </div>
      </div>
    )
  );
};

export default MovieSearchPage;
