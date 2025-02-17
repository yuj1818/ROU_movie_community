import styled from 'styled-components';
import MovieInfo from '../../components/movie/MovieInfo';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import tw from 'tailwind-styled-components';
import { getMovieDetail } from '../../utils/movieApi';

const Container = tw.div`
  w-4/5 flex flex-col gap-4 text-white pt-8
`;

const MovieDetailPage = () => {
  const [movieData, setMovieData] = useState();
  const params = useParams();

  useEffect(() => {
    const getMovieData = async () => {
      const res = await getMovieDetail(params.movie_id);
      setMovieData(res);
    };

    getMovieData();
  }, []);

  return (
    movieData && (
      <Container>
        <MovieInfo data={movieData} />
      </Container>
    )
  );
};

export default MovieDetailPage;
