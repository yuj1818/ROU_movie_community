import API from './axios';
import { getCookie, removeCookie, setCookie } from './cookie';

const URL = 'accounts/';

export const logIn = (data) => {
  return API.post(URL + 'login/', data)
    .then((res) => {
      const token = res.data.key;
      const user = res.data.user;
      console.log(res);
      setCookie('token', `Token ${token}`, { path: '/' });
      setCookie('userId', user, { path: '/' });
      return res;
    })
    .catch((err) => err);
};

export const logout = () => {
  return API.post(URL + 'logout/')
    .then(() => {
      removeCookie('token', { path: '/' });
      removeCookie('userId', { path: '/' });
    })
    .catch((err) => console.error(err));
};

export const checkLogin = () => {
  const token = getCookie('token');
  if (token) {
    return true;
  }
  return false;
};

export const signUp = (data) => {
  return API.post(URL + 'signup/', data)
    .then((res) => res)
    .catch((err) => err);
};

export const resign = () => {
  return API.post(URL + 'delete/')
    .then((res) => {
      removeCookie('token', { path: '/' });
      removeCookie('userId', { path: '/' });
      return res;
    })
    .catch((err) => err);
};

export const googleLogin = (params) => {
  return API.get(URL + 'google/login/', {
    params,
  })
    .then((res) => res)
    .catch((err) => err);
};

export const socialLoginAddInfo = (data) => {
  return API.post(URL + 'social/', data)
    .then((res) => {
      const token = res.data.key;
      const user = res.data.user;
      setCookie('token', `Token ${token}`, { path: '/' });
      setCookie('userId', user, { path: '/' });
      return res;
    })
    .catch((err) => err);
};

export const kakaoLogin = (params) => {
  return API.get(URL + 'kakao/login/', {
    params,
  })
    .then((res) => {
      const token = res.data.key;
      const user = res.data.user;
      setCookie('token', `Token ${token}`, { path: '/' });
      setCookie('userId', user, { path: '/' });
      return res;
    })
    .catch((err) => err);
};
