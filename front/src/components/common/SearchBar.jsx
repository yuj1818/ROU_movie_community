import styled from 'styled-components';
import Colors from '../../constants/Colors';
import { Search, CircleX } from 'lucide-react';
import { useState } from 'react';

const Container = styled.div`
  display: flex;
  padding: 0.25rem 0.5rem;
  gap: 0.25rem;
  background-color: ${Colors.bgGrayOp};
  width: 17.5%;
  max-width: 18.75rem;
  box-sizing: border-box;
  align-items: center;
  overflow: hidden;
  border-radius: 0.25rem;
`;

const Input = styled.input`
  width: 100%;
  font-size: 0.875rem;
  color: ${Colors.bgDarkGray};
  white-space: nowrap;
  text-overflow: ellipsis;
  background-color: transparent;
  outline: none;
`;

const SearchBar = () => {
  const [keyword, setKeyword] = useState('');

  return (
    <Container>
      <Search size="1.15rem" color={Colors.bgDarkGray} />
      <Input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="검색어를 입력해주세요"
      />
      {keyword.length > 0 && (
        <CircleX
          size="1.25rem"
          color={Colors.bgDarkGray}
          onClick={() => setKeyword('')}
        />
      )}
    </Container>
  );
};

export default SearchBar;
