import { useSelector } from 'react-redux';
import CastInfo from './CastInfo';
import { SubTitle } from './SubTitle';

const CastList = () => {
  const { movieInfo } = useSelector((state) => state.movie);

  return (
    <div className="flex w-full flex-col gap-2">
      <SubTitle>출연진</SubTitle>
      <div className="w-full flex flex-wrap max-h-[13rem] overflow-y-auto rounded-md text-white px-4 py-2 border border-solid border-white">
        {movieInfo.actors &&
          movieInfo.actors
            .slice(0, 18)
            .map((actor) => <CastInfo key={actor.id} actorInfo={actor} />)}
      </div>
    </div>
  );
};

export default CastList;
