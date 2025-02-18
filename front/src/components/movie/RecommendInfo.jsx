import styled from 'styled-components';
import Url from '../../constants/URL';

const Container = styled.div`
  width: 16.5%;
  aspect-ratio: 9 / 16;
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
