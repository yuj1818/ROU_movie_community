import styled from 'styled-components';
import Url from '../../constants/URL';
import { useNavigate } from 'react-router-dom';
import LazyImg from '../common/LazyImg';

const Container = styled.div`
  width: 16%;
  aspect-ratio: 3 /4;
  margin-bottom: 0.8%;
  cursor: pointer;
`;

const MovieCard = ({ data }) => {
  const navigate = useNavigate();

  return (
    <Container onClick={() => navigate(`/movie/${data.movie_id}`)}>
      <LazyImg
        className="w-full h-full"
        src={Url.tmdbImgPath + data.poster_path}
        alt="poster"
      />
    </Container>
  );
};

export default MovieCard;
