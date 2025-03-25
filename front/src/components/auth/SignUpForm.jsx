import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Colors from '../../constants/Colors';
import { Button } from '../common/Button';
import { SubTitle } from './SubTitle';
import tw from 'tailwind-styled-components';
import { signUp, socialLoginAddInfo } from '../../utils/authApi';
import { useSelector } from 'react-redux';

const Container = tw.div`
  flex flex-col w-full gap-1
`;

const Label = tw.label`
  text-sm
`;

const ErrMsg = tw.p`
  text-xs
  ${(props) => (props.$isValid ? 'text-green-600' : 'text-red-600')}
`;

const SignUpForm = () => {
  const [searchParams] = useSearchParams();
  const isSocial = searchParams.get('isSocial') === 'true';
  const { email } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [region, setRegion] = useState('');
  const [birth, setBirth] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [isValidPassword, setIsValidPassword] = useState(null);
  const [nickname, setNickname] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();

    if (isSocial) {
      const res = await socialLoginAddInfo({
        email,
        region,
        birth,
        nickname,
        username: email,
        password1: '임시비밀번호입니다',
        password2: '임시비밀번호입니다',
      });
      console.log(res);
      if (res.status === 201) {
        navigate('/');
      } else {
        if (Array.isArray(res.response.data)) {
          setErrMsg(res.response.data[0]);
        } else {
          setErrMsg(Object.values(res.response.data)[0][0]);
        }
      }
    } else {
      const res = await signUp({
        username,
        password1: password,
        password2: password2,
        region,
        birth,
        nickname,
      });
      console.log(res);
      if (res.status === 201) {
        navigate('/login');
      } else {
        if (Array.isArray(res.response.data)) {
          setErrMsg(res.response.data[0]);
        } else {
          setErrMsg(Object.values(res.response.data)[0][0]);
        }
      }
    }
  };

  useEffect(() => {
    if (password) {
      if (password !== password2) {
        setIsValidPassword(false);
      } else {
        setIsValidPassword(true);
      }
    }
  }, [password2]);

  return (
    <div className="w-1/2 py-6 flex flex-col gap-2 bg-neutral-300 rounded-lg items-center max-w-[25rem]">
      <SubTitle>{isSocial ? '추가 정보 기입' : '회원가입'}</SubTitle>
      <form className="w-2/3 flex flex-col gap-2" onSubmit={onSubmit}>
        {!isSocial && (
          <>
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
            <Container>
              <Label htmlFor="password2">비밀번호 재확인</Label>
              <input
                className="h-[2rem] p-2 w-full rounded-sm"
                type="password"
                id="password2"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
              />
            </Container>
            {isValidPassword !== null && (
              <ErrMsg $isValid={isValidPassword}>
                {isValidPassword
                  ? '비밀번호 일치'
                  : '비밀번호가 일치하지 않습니다'}
              </ErrMsg>
            )}
          </>
        )}
        <Container>
          <Label htmlFor="nickname">닉네임</Label>
          <input
            className="h-[2rem] p-2 w-full rounded-sm"
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </Container>
        <Container>
          <Label htmlFor="region">지역</Label>
          <input
            className="h-[2rem] p-2 w-full rounded-sm"
            type="text"
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />
        </Container>
        <Container>
          <Label htmlFor="birth">생년월일</Label>
          <input
            className="h-[2rem] p-2 w-full rounded-sm"
            type="date"
            id="birth"
            value={birth}
            onChange={(e) => setBirth(e.target.value)}
          />
        </Container>
        {errMsg && (
          <ErrMsg $isValid={false} className="text-center">
            {errMsg}
          </ErrMsg>
        )}
        <Button
          $marginTop={1}
          $isFullWidth={true}
          $background={Colors.btnPurple}
          disabled={
            isSocial
              ? region.trim() === '' ||
                birth.trim() === '' ||
                nickname.trim() === ''
              : username.trim() === '' ||
                password.trim() === '' ||
                region.trim() === '' ||
                birth.trim() === '' ||
                nickname.trim() === '' ||
                !isValidPassword
          }
        >
          회원가입
        </Button>
      </form>
      <a
        className="text-xs mt-2 text-blue-500 underline underline-offset-2"
        href="/login"
      >
        로그인
      </a>
    </div>
  );
};

export default SignUpForm;
