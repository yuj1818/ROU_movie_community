import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getGenreMovieList, getSortedMovieList } from '../../utils/movieApi';
import { setSortedMovies } from '../../stores/home';
import SortedMovieCarousel from './SortedMovieCarousel';
import tw from 'tailwind-styled-components';
import TagList from './TagList';

const ListContainer = tw.div`
  w-full h-fit flex flex-col items-center gap-2
`;

const Title = tw.p`
  font-pretendard_semibold text-white text-xl w-11/12
`;

const MovieList = () => {
  const { tags, sortTitles, selectedTag, sortedMovies } = useSelector(
    (state) => state.home,
  );
  const dispatch = useDispatch();

  const listRefs = useRef({});
  const tagListRef = useRef(null);

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

  useEffect(() => {
    if (selectedTag) {
      const element = listRefs.current[selectedTag];
      if (element) {
        const offset = tagListRef.current ? tagListRef.current.offsetHeight : 0;
        const elementPosition = element.offsetTop;

        const parentElement = element.parentNode.parentNode.parentNode;
        parentElement.scrollTop = elementPosition - offset - 24;
      }
    }
  }, [selectedTag]);

  return (
    <>
      <div
        className="w-11/12 flex flex-wrap gap-2 items-center sticky top-4 z-10"
        ref={tagListRef}
      >
        <TagList />
      </div>
      {Object.keys(sortedMovies).length === 23 && (
        <div className="w-full h-fit flex flex-col gap-8">
          {sortTitles &&
            sortTitles.map((item) => (
              <ListContainer
                ref={(el) => (listRefs.current[item.id] = el)}
                key={item.id}
              >
                <Title>{item.name}</Title>
                <SortedMovieCarousel id={item.id} />
              </ListContainer>
            ))}
          {tags &&
            tags.map((item) => (
              <ListContainer
                ref={(el) => (listRefs.current[item.id] = el)}
                key={item.id}
              >
                <Title>{item.name}</Title>
                <SortedMovieCarousel id={item.id} />
              </ListContainer>
            ))}
        </div>
      )}
    </>
  );
};

export default MovieList;
