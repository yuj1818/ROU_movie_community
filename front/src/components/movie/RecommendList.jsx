import { useEffect, useState } from 'react';
import { getRecommendMovieList } from '../../utils/movieApi';
import { SubTitle } from './SubTitle';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import MovieCard from './MovieCard';
import { checkLogin } from '../../utils/authApi';

const InfoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: flex-start;
  gap: 0.8%;
`;

const RecommendList = ({ title }) => {
  const { movieInfo } = useSelector((state) => state.movie);
  const [movieData, setMovieData] = useState([]);

  useEffect(() => {
    if (checkLogin()) {
      const getMovieData = async () => {
        const res = await getRecommendMovieList({ title: movieInfo.title });
        setMovieData(res);
      };

      getMovieData();
    }
  }, [movieInfo]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <SubTitle>"{title}" 와(과) 비슷한 영화</SubTitle>
      <InfoContainer>
        {checkLogin() ? (
          movieData && movieData.length ? (
            movieData.map((data) => (
              <MovieCard key={data.movie_id} data={data} />
            ))
          ) : (
            <p className="text-gray-600 text-center">추천 영화가 없습니다</p>
          )
        ) : (
          <p className="text-gray-600 text-center">회원 전용 서비스입니다</p>
        )}
      </InfoContainer>
    </div>
  );
};

export default RecommendList;
