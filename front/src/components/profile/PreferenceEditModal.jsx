import { useEffect, useState } from 'react';
import { Line } from '../common/Line';
import { useSelector } from 'react-redux';
import { Badge } from '../common/Badge';
import { CheckBox } from './CheckBox';
import { Button } from '../common/Button';

const PreferenceEditModal = () => {
  const { like_genres, hate_genres } = useSelector((state) => state.profile);
  const { tags } = useSelector((state) => state.home);
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

  return (
    <div className="bg-white h-fit w-1/2 max-w-[28rem] p-8 rounded-sm flex flex-col justify-center gap-2 relative z-1">
      <p className="text-lg">{isLike ? '선호 장르' : '불호 장르'}</p>
      <Line />
      {isLike ? (
        <li className="w-full flex flex-wrap gap-2 my-4 justify-center">
          {tags.map((tag) => (
            <>
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
              />
            </>
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
      <Button className="self-center" $marginLeft={0}>
        저장
      </Button>
    </div>
  );
};

export default PreferenceEditModal;
