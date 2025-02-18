import { useEffect, useState } from 'react';
import { getRecommendMovieList } from '../../utils/movieApi';
import { SubTitle } from './SubTitle';
import styled from 'styled-components';
import RecommendInfo from './RecommendInfo';

const InfoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
  margin: 0 auto;
  & > div:last-child {
    margin-right: auto;
  }
`;

const RecommendList = ({ title }) => {
  const [movieData, setMovieData] = useState([]);

  // useEffect(() => {
  //   const getMovieData = async () => {
  //     const res = await getRecommendMovieList(title);
  //     setMovieData(res);
  //   };

  //   getMovieData();
  // }, [title]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <SubTitle>추천 영화</SubTitle>
      <InfoContainer>
        <p className="text-gray-600 text-center">추천 영화가 없습니다</p>
        {/* {movieData && movieData.length ? (
          movieData.map((data) => (
            <RecommendInfo key={data.movie_id} data={data} />
          ))
        ) : (
          <p className="text-gray-600 text-center">추천 영화가 없습니다</p>
        )} */}
      </InfoContainer>
    </div>
  );
};

export default RecommendList;
