import styled from 'styled-components';
import Url from '../../constants/URL';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  width: 16%;
  aspect-ratio: 3 /4;
  margin: 0.25%;
`;

const MovieCard = ({ data }) => {
  const navigate = useNavigate();

  return (
    <Container onClick={() => navigate(`/movie/${data.movie_id}`)}>
      <img
        className="w-full h-full"
        src={Url.tmdbImgPath + data.poster_path}
        alt="poster"
      />
    </Container>
  );
};

export default MovieCard;
