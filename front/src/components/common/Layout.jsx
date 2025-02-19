import styled from 'styled-components';
import SideBar from './SideBar';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Container = styled.div`
  display: block;
  background-color: black;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  height: 100vh;
  overflow: hidden;
`;

const Content = styled.div`
  width: 100%;
  padding-left: 213px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
`;

const OutletContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Layout = () => {
  return (
    <Container>
      <SideBar />
      <Content>
        <Header />
        <OutletContainer>
          <Outlet />
        </OutletContainer>
      </Content>
    </Container>
  );
};

export default Layout;
