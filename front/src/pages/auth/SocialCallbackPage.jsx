import { useEffect } from 'react';
import { googleLogin } from '../../utils/authApi';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setEmail } from '../../stores/auth';

const SocialCallbackPage = () => {
  const onGoogleLogin = async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const res = await googleLogin({ code });
    if (res.status == 200) {
      console.log(res.data);
    } else if (res.status == 202) {
      dispatch(setEmail(res.data.email));
      // 추가 정보 기입 페이지로 이동
    }
  };

  useEffect(() => {
    onGoogleLogin();
  }, []);

  return <div></div>;
};

export default SocialCallbackPage;
