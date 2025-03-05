import styled from 'styled-components';
import logo from '../../assets/logo.png';
import Colors from '../../constants/Colors';
import { useNavigate } from 'react-router-dom';
import LazyImg from './LazyImg';
import { getCookie } from '../../utils/cookie';
import { checkLogin } from '../../utils/authApi';

const Container = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 213px;
  background-color: #222222;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
  gap: 1rem;

  .logo {
    width: 90%;
    cursor: pointer;
  }
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
`;

const Menu = styled.span`
  font-size: 1.75rem;
  color: white;
  cursor: pointer;

  &:hover {
    color: ${Colors.btnPurple};
  }
`;

const SideBar = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <LazyImg className="logo" src={logo} onClick={() => navigate('/')} />
      <MenuContainer>
        <Menu onClick={() => navigate('/')}>Home</Menu>
        {checkLogin() && (
          <Menu onClick={() => navigate(`/profile/${getCookie('userId')}`)}>
            Profile
          </Menu>
        )}
        <Menu>Review</Menu>
      </MenuContainer>
    </Container>
  );
};

export default SideBar;
