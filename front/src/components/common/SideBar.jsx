import styled from 'styled-components';
import logo from '../../assets/logo.png';
import Colors from '../../constants/Colors';

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

  &:hover {
    color: ${Colors.btnPurple};
  }
`;

const SideBar = () => {
  return (
    <Container>
      <img className="logo" src={logo} />
      <MenuContainer>
        <Menu>Home</Menu>
        <Menu>Profile</Menu>
        <Menu>Review</Menu>
      </MenuContainer>
    </Container>
  );
};

export default SideBar;
