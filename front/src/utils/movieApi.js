import API from './axios';

const URL = 'movies/';

export const getTrendMovieList = () => {
  return API.get(URL + 'trends/')
    .then((res) => res.data)
    .catch((err) => console.error(err));
};

export const getMovieDetail = (movie_id) => {
  return API.get(URL + movie_id)
    .then((res) => res.data)
    .catch((err) => console.error(err));
};

export const getMovieReviewList = (movie_id) => {
  return API.get(URL + `review/${movie_id}`)
    .then((res) => res.data)
    .catch((err) => console.error(err));
};

export const getRecommendMovieList = (params) => {
  return API.get(URL + 'recommend/', { params })
    .then((res) => res.data)
    .catch((err) => console.error(err));
};

export const likeMovie = (movie_id) => {
  return API.post(URL + `like/${movie_id}`)
    .then((res) => res.data)
    .catch((err) => console.error(err));
};
