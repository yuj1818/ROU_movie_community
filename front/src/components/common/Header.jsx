import styled from 'styled-components';
import Colors from '../../constants/Colors';
import { Button } from './Button';
import { checkLogin, logout } from '../../utils/authApi';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: ${Colors.headerBlack};
  padding: 1rem;
  gap: 0.75rem;
`;

const Header = () => {
  const navigate = useNavigate();

  const onClickBtn = async () => {
    if (checkLogin()) {
      await logout();
    }
    navigate('/login');
  };

  return (
    <Container>
      <Button onClick={onClickBtn} $background={Colors.btnPurple}>
        {checkLogin() ? '로그아웃' : '로그인'}
      </Button>
      <SearchBar />
    </Container>
  );
};

export default Header;
