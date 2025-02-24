import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Colors from '../../constants/Colors';
import { Button } from '../common/Button';
import { SubTitle } from './SubTitle';
import tw from 'tailwind-styled-components';
import { logIn } from '../../utils/authApi';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../stores/auth';

const Container = tw.div`
  flex flex-col w-full gap-1
`;

const Label = tw.label`
  text-sm
`;

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await logIn({
      username,
      password,
    });
    if (res.status === 200) {
      dispatch(setLogin());
      navigate('/');
    } else {
      setErrMsg('아이디와 비밀번호를 다시 확인해주세요');
    }
  };

  return (
    <div className="w-1/2 py-6 flex flex-col gap-2 bg-neutral-300 rounded-lg items-center max-w-[25rem]">
      <SubTitle>로그인</SubTitle>
      <form className="w-2/3 flex flex-col gap-2" onSubmit={onSubmit}>
        <Container>
          <Label htmlFor="username">아이디</Label>
          <input
            className="h-[2rem] p-2 w-full rounded-sm"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Container>
        <Container>
          <Label htmlFor="password">비밀번호</Label>
          <input
            className="h-[2rem] p-2 w-full rounded-sm"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Container>
        {errMsg && <p className="text-red-600 text-xs text-center">{errMsg}</p>}
        <Button
          $marginTop={1}
          $isFullWidth={true}
          $background={Colors.btnPurple}
          disabled={username.trim() === '' || password.trim() === ''}
        >
          로그인
        </Button>
      </form>
      <a
        className="text-xs mt-2 text-blue-500 underline underline-offset-2"
        href="/signup"
      >
        회원가입
      </a>
    </div>
  );
};

export default LoginForm;
