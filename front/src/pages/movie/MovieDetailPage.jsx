import MovieInfo from '../../components/movie/MovieInfo';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import tw from 'tailwind-styled-components';
import { getMovieDetail } from '../../utils/movieApi';
import { useDispatch, useSelector } from 'react-redux';
import { setMovieInfo } from '../../stores/movie';
import CastList from '../../components/movie/CastList';
import ReviewList from '../../components/movie/ReviewList';
import RecommendList from '../../components/movie/RecommendList';

const Container = tw.div`
  w-4/5 flex flex-col gap-8 text-white py-8 h-fit
`;

const MovieDetailPage = () => {
  const { movieInfo } = useSelector((state) => state.movie);
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    const getMovieData = async () => {
      const res = await getMovieDetail(params.movie_id);
      dispatch(setMovieInfo(res));
    };

    getMovieData();
  }, [params.movie_id]);

  return (
    movieInfo &&
    movieInfo.movie_id == params.movie_id && (
      <Container>
        <MovieInfo />
        <CastList />
        <ReviewList />
        <RecommendList title={movieInfo.title} />
      </Container>
    )
  );
};

export default MovieDetailPage;
