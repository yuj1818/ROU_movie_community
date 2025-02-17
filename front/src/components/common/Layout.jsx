import styled from 'styled-components';
import SideBar from './SideBar';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Container = styled.div`
  display: flex;
  background-color: black;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;

const Content = styled.div`
  width: 100%;
  padding-left: 213px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Layout = () => {
  return (
    <Container>
      <SideBar />
      <Content>
        <Header />
        <Outlet />
      </Content>
    </Container>
  );
};

export default Layout;
