import { useSelector } from 'react-redux';
import CastInfo from './CastInfo';
import styled from 'styled-components';
import Colors from '../../constants/Colors';
import { SubTitle } from './SubTitle';

const CastContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  max-height: 13rem;
  overflow-y: auto;
  border-radius: 0.25rem;
  color: black;
  padding: 0.5rem 1rem;
  border: 1px solid white;
  color: white;

  &::-webkit-scrollbar {
    width: 20px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${Colors.btnPurple};
    border-radius: 15px;
    border: 6px solid transparent;
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
    <div className="flex w-full flex-col gap-2">
      <SubTitle>출연진</SubTitle>
      <CastContainer>
        {movieInfo.actors &&
          movieInfo.actors
            .slice(0, 18)
            .map((actor) => <CastInfo key={actor.id} actorInfo={actor} />)}
      </CastContainer>
    </div>
  );
};

export default CastList;
