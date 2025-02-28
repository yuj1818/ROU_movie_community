import API from './axios';

const URL = 'community/';

export const getPostDetail = (review_id) => {
  return API.get(URL + `${review_id}/`)
    .then((res) => res.data)
    .catch((err) => console.error(err));
};

export const likePost = (review_id) => {
  return API.post(URL + `like/${review_id}/`)
    .then((res) => res.data)
    .catch((err) => console.error(err));
};

export const dislikePost = (review_id) => {
  return API.post(URL + `dislike/${review_id}/`)
    .then((res) => res.data)
    .catch((err) => console.error(err));
};
