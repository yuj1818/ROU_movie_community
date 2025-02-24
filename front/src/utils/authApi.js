import API from './axios';
import { getCookie, removeCookie, setCookie } from './cookie';

const URL = 'accounts/';

export const logIn = (data) => {
  return API.post(URL + 'login/', data)
    .then((res) => {
      const token = res.data.key;
      const user = res.data.user;
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
  const token = getCookie('key');
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
