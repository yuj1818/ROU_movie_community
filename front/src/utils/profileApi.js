import API from './axios';

const URL = 'accounts/';

export const getProfileData = (user_id) => {
  return API.get(URL + `profile/${user_id}/`)
    .then((res) => res.data)
    .catch((err) => err);
};
