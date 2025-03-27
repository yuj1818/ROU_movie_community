import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { kakaoLogin } from '../../utils/authApi';

const KakaoCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const onKakaoLogin = async () => {
    const code = searchParams.get('code');
    const res = await kakaoLogin({ code });
    if (res.status === 201 || res.status === 200) {
      navigate('/');
    }
  };

  useEffect(() => {
    onKakaoLogin();
  }, []);

  return <div></div>;
};

export default KakaoCallbackPage;
