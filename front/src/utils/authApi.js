import API from './axios';
import { setCookie } from './cookie';

const URL = 'accounts/';

export const signIn = (data) => {
  return API.post(URL + 'login', data)
    .then((res) => {
      const token = res.data.key;
      const user = res.data.user;
      setCookie('key', `Token ${token}`, { path: '/' });
      setCookie('userId', user, { path: '/' });
      return res;
    })
    .catch((err) => err);
};
