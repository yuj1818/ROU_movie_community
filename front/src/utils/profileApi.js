import API from './axios';

const URL = 'accounts/';

export const getProfileData = (user_id) => {
  return API.get(URL + `profile/${user_id}/`)
    .then((res) => res.data)
    .catch((err) => err);
};

export const follow = (user_id) => {
  return API.post(URL + `follow/${user_id}/`)
    .then((res) => res.data)
    .catch((err) => err);
};

export const updateProfileData = (user_id, data) => {
  return API.put(URL + `profile/${user_id}/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then((res) => res.data)
    .catch((err) => err);
};

export const updatePreferenceData = (pType, data) => {
  return API.put(URL + `preference/${pType}/`, data)
    .then((res) => res.data)
    .catch((err) => err);
};

export const getProfileMovieData = (user_id, params) => {
  return API.get(URL + `movie/${user_id}/`, { params })
    .then((res) => res.data)
    .catch((err) => err);
};

export const getRecommendedUsers = () => {
  return API.get(URL + 'friend/')
    .then((res) => res.data)
    .catch((err) => console.error(err));
};
