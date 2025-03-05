import styled from 'styled-components';
import Url from '../../constants/URL';
import { useNavigate } from 'react-router-dom';
import LazyImg from '../common/LazyImg';

const Container = styled.div`
  width: 24.75%;
  cursor: pointer;
  max-height: 33%;
`;

const MovieCard = ({ data }) => {
  const navigate = useNavigate();

  return (
    <Container onClick={() => navigate(`/movie/${data.movie_id}`)}>
      <div className="w-full aspect-3/4">
        <LazyImg
          className="w-full h-full"
          src={Url.tmdbImgPath + data.poster_path}
          alt="poster"
        />
      </div>
    </Container>
  );
};

export default MovieCard;
