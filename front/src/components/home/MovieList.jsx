import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGenreMovieList, getSortedMovieList } from '../../utils/movieApi';
import { setSortedMovies } from '../../stores/home';
import SortedMovieCarousel from './SortedMovieCarousel';
import tw from 'tailwind-styled-components';

const ListContainer = tw.div`
  w-full h-fit flex flex-col items-center gap-2
`;

const Title = tw.p`
  font-pretendard_semibold text-white text-xl w-11/12
`;

const MovieList = () => {
  const { tags, sortTitles, selectedTag } = useSelector((state) => state.home);
  const dispatch = useDispatch();

  const getGenreMovies = async (id) => {
    const res = await getGenreMovieList(id);
    dispatch(setSortedMovies({ id: id, data: res }));
  };

  const getSortedMovies = async (key, id) => {
    const res = await getSortedMovieList({ key: key });
    dispatch(setSortedMovies({ id: id, data: res }));
  };

  useEffect(() => {
    sortTitles.forEach((title) => {
      getSortedMovies(title.key, title.id);
    });

    tags.forEach((tag) => {
      getGenreMovies(tag.id);
    });
  }, []);

  return (
    <div className="w-full h-fit flex flex-col gap-8">
      {sortTitles &&
        sortTitles.map((item) => (
          <ListContainer>
            <Title>{item.name}</Title>
            <SortedMovieCarousel key={item.id} id={item.id} />
          </ListContainer>
        ))}
      {tags &&
        tags.map((item) => (
          <ListContainer>
            <Title>{item.name}</Title>
            <SortedMovieCarousel key={item.id} id={item.id} />
          </ListContainer>
        ))}
    </div>
  );
};

export default MovieList;
