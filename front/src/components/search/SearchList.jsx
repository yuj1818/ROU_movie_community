import styled from 'styled-components';
import MovieCard from '../movie/MovieCard';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: flex-start;
  gap: 0.8%;
`;

const SearchList = ({ searchData }) => {
  return (
    searchData && (
      <Container>
        {searchData.map((data) => (
          <MovieCard key={data.movie_id} data={data} />
        ))}
      </Container>
    )
  );
};

export default SearchList;
