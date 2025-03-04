import { Fragment, useState } from 'react';
import { Line } from '../common/Line';
import { useDispatch, useSelector } from 'react-redux';
import { CheckBox } from './CheckBox';
import { Button } from '../common/Button';
import { updatePreferenceData } from '../../utils/profileApi';
import { setHateGenres, setLikeGenres } from '../../stores/profile';
import { closeModal } from '../../stores/modal';

const PreferenceEditModal = () => {
  const { like_genres, hate_genres } = useSelector((state) => state.profile);
  const { tags } = useSelector((state) => state.home);
  const dispatch = useDispatch();
  const [isLike, setIsLike] = useState(true);
  const [likeSelection, setLikeSelection] = useState(() => {
    const initValue = {};
    for (const tag of tags) {
      initValue[tag.name] = false;
    }

    for (const genre of like_genres) {
      initValue[genre.name] = true;
    }

    return initValue;
  });

  const [hateSelection, setHateSelection] = useState(() => {
    const initValue = {};
    for (const tag of tags) {
      initValue[tag.name] = false;
    }

    for (const genre of hate_genres) {
      initValue[genre.name] = true;
    }

    return initValue;
  });

  const onChange = (e) => {
    const { id, checked } = e.target;
    if (isLike) {
      setLikeSelection((prev) => ({
        ...prev,
        [id]: checked,
      }));
    } else {
      setHateSelection((prev) => ({
        ...prev,
        [id]: checked,
      }));
    }
  };

  const onUpdatePreference = async () => {
    const pType = isLike ? 'like' : 'hate';
    if (isLike) {
      const data = {
        genres: Object.keys(likeSelection)
          .filter((key) => likeSelection[key])
          .join(','),
      };
      const res = await updatePreferenceData(pType, data);
      dispatch(setLikeGenres(res.like_genres));
      setIsLike(false);
    } else {
      const data = {
        genres: Object.keys(hateSelection)
          .filter((key) => hateSelection[key])
          .join(','),
      };
      const res = await updatePreferenceData(pType, data);
      dispatch(setHateGenres(res.hate_genres));
      dispatch(closeModal());
    }
  };

  return (
    <div className="bg-white h-fit w-1/2 max-w-[28rem] p-8 rounded-sm flex flex-col justify-center gap-2 relative z-1 shadow-md shadow-gray-500">
      <p className="text-lg">{isLike ? '선호 장르' : '불호 장르'}</p>
      <Line />
      {isLike ? (
        <li className="w-full flex flex-wrap gap-2 my-4 justify-center">
          {tags.map((tag) => (
            <Fragment key={tag.id}>
              <CheckBox
                htmlFor={tag.name}
                $isLike={isLike}
                $isChecked={likeSelection[tag.name]}
              >
                {tag.name}
              </CheckBox>
              <input
                id={tag.name}
                type="checkbox"
                className="hidden"
                onChange={onChange}
                checked={likeSelection[tag.name]}
              />
            </Fragment>
          ))}
        </li>
      ) : (
        <li className="w-full flex flex-wrap gap-2 my-4 justify-center">
          {tags.map((tag) => (
            <>
              <CheckBox
                htmlFor={tag.name}
                $isLike={isLike}
                $isChecked={hateSelection[tag.name]}
              >
                {tag.name}
              </CheckBox>
              <input
                id={tag.name}
                type="checkbox"
                className="hidden"
                onChange={onChange}
              />
            </>
          ))}
        </li>
      )}
      <Button
        className="self-center"
        $marginLeft={0}
        onClick={onUpdatePreference}
      >
        저장
      </Button>
    </div>
  );
};

export default PreferenceEditModal;
