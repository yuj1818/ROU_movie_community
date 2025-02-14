import styled from 'styled-components';

const Container = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: #222222;
`;

const Header = () => {
  return <Container></Container>;
};

export default Header;
