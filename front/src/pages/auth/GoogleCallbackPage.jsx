import { useEffect } from 'react';
import { googleLogin } from '../../utils/authApi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setEmail, setUid } from '../../stores/auth';
import { setCookie } from '../../utils/cookie';

const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onGoogleLogin = async () => {
    const code = searchParams.get('code');

    const res = await googleLogin({ code });
    if (res.status == 200) {
      const token = res.data.key;
      const user = res.data.user;
      setCookie('token', `Token ${token}`, { path: '/' });
      setCookie('userId', user, { path: '/' });
      navigate('/');
    } else if (res.status == 202) {
      dispatch(setEmail(res.data.email));
      dispatch(setUid(res.data.uid));
      // 추가 정보 기입 페이지로 이동
      navigate({ pathname: '/signup', search: `?isSocial=${true}` });
    }
  };

  useEffect(() => {
    onGoogleLogin();
  }, []);

  return <div></div>;
};

export default GoogleCallbackPage;
