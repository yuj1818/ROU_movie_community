import { useDispatch, useSelector } from 'react-redux';
import tw from 'tailwind-styled-components';
import { setPage, setTarget, setTotalItems } from '../../stores/profile';
import { useEffect, useState } from 'react';
import { getProfileMovieData } from '../../utils/profileApi';
import MovieCard from './MovieCard';
import Pagination from '../common/Pagination';
import Colors from '../../constants/Colors';

const Category = tw.div`
  w-[25%] px-4 py-2 rounded-t font-pretendard_semibold text-center cursor-pointer
  ${(props) => (props.$isSelected ? 'bg-white text-black' : 'text-white')}
`;

const MovieList = () => {
  const { targets, targetIdx, userId, page, totalItems } = useSelector(
    (state) => state.profile,
  );
  const dispatch = useDispatch();
  const [selectedData, setSelectedData] = useState([]);

  const onPageChange = (newPage) => {
    dispatch(setPage(newPage));
  };

  useEffect(() => {
    const getSelectedData = async () => {
      let target = '';
      if (targetIdx === 0) {
        target = 'like';
      } else if (targetIdx === 1) {
        target = 'review';
      } else if (targetIdx === 2) {
        target = 'favorite';
      } else {
        target = 'watch';
      }

      const res = await getProfileMovieData(userId, {
        target: target,
        page: page,
        limit: 12,
      });

      setSelectedData(res.results);
      dispatch(setTotalItems(res.count));
    };

    if (userId) {
      getSelectedData();
    }
  }, [targetIdx, page, userId]);

  return (
    <div className="w-[68%] h-full flex flex-col">
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
      <div className="h-[5rem] bg-white aspect-square rounded-b p-2 mb-2">
        {selectedData && (
          <div className="flex flex-wrap justify-start w-full h-full">
            {selectedData.map((data) => (
              <MovieCard key={data.movie_id} data={data} />
            ))}
          </div>
        )}
      </div>
      <Pagination
        currentPage={page}
        totalPages={Math.ceil(totalItems / 12)}
        onPageChange={onPageChange}
        color={Colors.btnPurple}
      />
    </div>
  );
};

export default MovieList;
