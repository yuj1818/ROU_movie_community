import { useSelector } from 'react-redux';
import CastInfo from './CastInfo';
import styled from 'styled-components';
import Colors from '../../constants/Colors';

const CastContainer = styled.div`
  width: 100%;
  background-color: white;
  display: flex;
  flex-wrap: wrap;
  max-height: 13rem;
  overflow-y: auto;
  border-radius: 0.25rem;
  color: black;
  padding: 0.5rem 1rem;

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
    <div className="flex w-full flex-col gap-2">
      <p className="font-pretendard_semibold text-xl text-white">출연진</p>
      <CastContainer>
        {movieInfo.actors &&
          movieInfo.actors.map((actor) => (
            <CastInfo key={actor.id} actorInfo={actor} />
          ))}
      </CastContainer>
    </div>
  );
};

export default CastList;
