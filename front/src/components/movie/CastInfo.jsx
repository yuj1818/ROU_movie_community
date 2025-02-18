import Url from '../../constants/URL';
import unknown from '../../assets/profile.png';

const CastInfo = ({ actorInfo }) => {
  return (
    <div className="w-1/2 h-[4rem] px-4 py-2 flex gap-4 items-center">
      <img
        src={
          actorInfo.profile_path
            ? Url.tmdbImgPath + actorInfo.profile_path
            : unknown
        }
        className="h-[3rem] rounded-full w-[3rem]"
        alt="actor_img"
      />
      <p>{actorInfo.name}</p>
    </div>
  );
};

export default CastInfo;
