import styled from 'styled-components';
import Colors from '../../constants/Colors';
import { Button } from './Button';
import { logout } from '../../utils/authApi';
import { useDispatch, useSelector } from 'react-redux';
import { setLogout } from '../../stores/auth';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: ${Colors.headerBlack};
  padding: 1rem;
`;

const Header = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const onClickBtn = async () => {
    if (isLoggedIn) {
      await logout();
      dispatch(setLogout());
    } else {
      navigate('/login');
    }
  };

  return (
    <Container>
      <Button onClick={onClickBtn} $background={Colors.btnPurple}>
        {isLoggedIn ? '로그아웃' : '로그인'}
      </Button>
    </Container>
  );
};

export default Header;
