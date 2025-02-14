import styled from 'styled-components';
import logo from '../../assets/logo.png';

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

  .logo {
    width: 90%;
  }
`;

const SideBar = () => {
  return (
    <Container>
      <img className="logo" src={logo} />
    </Container>
  );
};

export default SideBar;
