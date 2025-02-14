import styled from 'styled-components';
import MovieCarousel from '../components/home/MovieCarousel';

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  width: 100%;
  padding: 1rem;
`;

const HomePage = () => {
  return (
    <Container>
      <MovieCarousel />
    </Container>
  );
};

export default HomePage;
