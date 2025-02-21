import styled from 'styled-components';
import MovieCarousel from '../components/home/MovieCarousel';
import tw from 'tailwind-styled-components';
import TagList from '../components/home/TagList';
import MovieList from '../components/home/MovieList';

const Container = tw.div`
  grow flex flex-col w-full p-4 gap-8 h-fit items-center relative
`;

const HomePage = () => {
  return (
    <Container>
      <MovieCarousel />
      <MovieList />
    </Container>
  );
};

export default HomePage;
