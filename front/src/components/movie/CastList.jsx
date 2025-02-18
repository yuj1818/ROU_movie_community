import { useSelector } from 'react-redux';
import CastInfo from './CastInfo';
import styled from 'styled-components';
import Colors from '../../constants/Colors';

const Container = styled.div`
  width: 100%;
  background-color: white;
  display: flex;
  flex-wrap: wrap;
  max-height: 13rem;
  overflow-y: auto;
  border-radius: 0.25rem;
  color: black;
  padding: 1rem;

  &::-webkit-scrollbar {
    width: 15px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${Colors.btnDarkPurple};
    border-radius: 15px;
    border: 3px solid transparent;
    background-clip: padding-box;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
    border-radius: 15px;
  }
`;

const CastList = () => {
  const { movieInfo } = useSelector((state) => state.movie);

  return (
    <Container>
      {movieInfo.actors &&
        movieInfo.actors.map((actor) => <CastInfo actorInfo={actor} />)}
    </Container>
  );
};

export default CastList;
