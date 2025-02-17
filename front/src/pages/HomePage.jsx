import styled from 'styled-components';
import MovieCarousel from '../components/home/MovieCarousel';
import tw from 'tailwind-styled-components';

const Container = tw.div`
  grow flex w-full p-4
`;

const HomePage = () => {
  return (
    <Container>
      <MovieCarousel />
    </Container>
  );
};

export default HomePage;
