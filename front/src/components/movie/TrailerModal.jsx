import { useSelector } from 'react-redux';
import { Line } from '../common/Line';
import Url from '../../constants/URL';

const TrailerModal = () => {
  const { movieInfo } = useSelector((state) => state.movie);

  return (
    <div className="bg-white h-fit w-1/2 p-8 rounded-sm flex flex-col gap-4 relative z-1">
      <p className="font-pretendard_semibold">{movieInfo.title} 트레일러</p>
      <Line />
      <iframe
        className="aspect-video w-full"
        loading="lazy"
        src={`${Url.youtubePath}${movieInfo.videos}?autoplay=1&mute=0&loop=1&controls=1&rel=0&modestbranding=1`}
        allow="autoplay; encrypted-media"
      />
    </div>
  );
};

export default TrailerModal;
