import Colors from '../../constants/Colors';
import { Button } from '../common/Button';
import { SubTitle } from './SubTitle';
import tw from 'tailwind-styled-components';

const Container = tw.div`
  flex flex-col w-full gap-1
`;

const Label = tw.label`
  text-sm
`;

const LoginForm = () => {
  return (
    <div className="w-1/2 py-6 flex flex-col gap-2 bg-neutral-300 rounded-lg items-center max-w-[25rem]">
      <SubTitle>로그인</SubTitle>
      <form className="w-2/3 flex flex-col gap-2">
        <Container>
          <Label htmlFor="username">아이디</Label>
          <input
            className="h-[2rem] p-2 w-full rounded-sm"
            type="text"
            id="username"
          />
        </Container>
        <Container>
          <Label htmlFor="password">비밀번호</Label>
          <input
            className="h-[2rem] p-2 w-full rounded-sm"
            type="password"
            id="password"
          />
        </Container>
        <Button $isFullWidth={true} $background={Colors.btnPurple}>
          로그인
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
