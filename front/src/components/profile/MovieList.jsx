import { useDispatch, useSelector } from 'react-redux';
import tw from 'tailwind-styled-components';
import { setTarget } from '../../stores/profile';
import { useEffect } from 'react';

const Category = tw.div`
  w-[25%] px-4 py-2 rounded-t font-pretendard_semibold text-center cursor-pointer
  ${(props) => (props.$isSelected ? 'bg-white text-black' : 'text-white')}
`;

const MovieList = () => {
  const { targets, targetIdx } = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  useEffect(() => {}, [targetIdx]);

  return (
    <div className="w-[68%] flex flex-col">
      <div className="flex">
        {targets.map((target, idx) => (
          <Category
            key={target}
            $isSelected={idx === targetIdx}
            onClick={() => dispatch(setTarget(idx))}
          >
            {target}
          </Category>
        ))}
      </div>
      <div className="bg-white w-full aspect-4/3 rounded-b rounded-tr p-2"></div>
    </div>
  );
};

export default MovieList;
