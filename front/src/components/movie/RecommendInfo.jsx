import styled from 'styled-components';
import Url from '../../constants/URL';

const Container = styled.div`
  width: 16%;
  aspect-ratio: 3 /4;
  margin: 0.25%;
`;

const RecommendInfo = ({ data }) => {
  return (
    <Container>
      <img
        className="w-full h-full"
        src={Url.tmdbImgPath + data.poster_path}
        alt="poster"
      />
    </Container>
  );
};

export default RecommendInfo;
