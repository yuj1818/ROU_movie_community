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

export const editPostData = (review_id, data) => {
  return API.put(URL + `${review_id}/`, data)
    .then((res) => res.data)
    .catch((err) => console.error(err));
};

export const deletePostData = (review_id) => {
  return API.delete(URL + `${review_id}/`)
    .then((res) => res)
    .catch((err) => console.error(err));
};

export const getCommentData = (review_id) => {
  return API.get(URL + `comment/${review_id}/`)
    .then((res) => res.data)
    .catch((err) => console.error(err));
};

export const createComment = (review_id, data) => {
  return API.post(URL + `comment/${review_id}/`, data)
    .then((res) => res.data)
    .catch((err) => console.error(err));
};

export const createRecomment = (review_id, comment_id, data) => {
  return API.post(URL + `comment/${review_id}/${comment_id}/`, data)
    .then((res) => res.data)
    .catch((err) => console.error(err));
};

export const deleteComment = (review_id, comment_id) => {
  return API.delete(URL + `comment/${review_id}/${comment_id}/`)
    .then((res) => res)
    .catch((err) => console.error(err));
};

export const editComment = (review_id, comment_id, data) => {
  return API.put(URL + `comment/${review_id}/${comment_id}/`, data)
    .then((res) => res.data)
    .catch((err) => console.error(err));
};

export const likeComment = (review_id, comment_id) => {
  return API.post(URL + `comment/like/${review_id}/${comment_id}/`)
    .then((res) => res.data)
    .catch((err) => console.error(err));
};

export const getPostData = (params) => {
  return API.get(URL, { params })
    .then((res) => res.data)
    .catch((err) => console.error(err));
};

export const createPost = (data) => {
  return API.post(URL, data)
    .then((res) => res.data)
    .catch((err) => console.error(err));
};
