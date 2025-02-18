import { useSelector } from 'react-redux';
import CastInfo from './CastInfo';

const CastList = () => {
  const { movieInfo } = useSelector((state) => state.movie);

  return (
    <div className="w-full bg-white flex flex-wrap max-h-[13rem] overflow-y-auto rounded-sm text-black p-4">
      {movieInfo.actors &&
        movieInfo.actors.map((actor) => <CastInfo actorInfo={actor} />)}
    </div>
  );
};

export default CastList;
