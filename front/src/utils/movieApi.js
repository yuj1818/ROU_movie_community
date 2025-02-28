import API from './axios';

const URL = 'movies/';

export const getTrendMovieList = () => {
  return API.get(URL + 'trends/')
    .then((res) => res.data)
    .catch((err) => console.error(err));
};

export const getMovieDetail = (movie_id) => {
  return API.get(URL + `${movie_id}/`)
    .then((res) => res.data)
    .catch((err) => console.error(err));
};

export const getMovieReviewList = (movie_id) => {
  return API.get(URL + `review/${movie_id}/`)
    .then((res) => res.data)
    .catch((err) => console.error(err));
};

export const getRecommendMovieList = (params) => {
  return API.get(URL + 'recommend/', { params })
    .then((res) => res.data)
    .catch((err) => console.error(err));
};

export const likeMovie = (movie_id) => {
  return API.post(URL + `like/${movie_id}/`)
    .then((res) => res.data)
    .catch((err) => console.error(err));
};

export const dislikeMovie = (movie_id) => {
  return API.post(URL + `dislike/${movie_id}/`)
    .then((res) => res.data)
    .catch((err) => console.error(err));
};

export const watchMovie = (movie_id) => {
  return API.post(URL + `watch/${movie_id}/`)
    .then((res) => res.data)
    .catch((err) => console.error(err));
};

export const favoriteMovie = (movie_id) => {
  return API.post(URL + `favorite/${movie_id}/`)
    .then((res) => res.data)
    .catch((err) => console.error(err));
};

export const searchMovie = (params) => {
  return API.get(URL + 'search/', { params })
    .then((res) => res.data)
    .catch((err) => console.error(err));
};

export const getSortedMovieList = (params) => {
  return API.get(URL + 'sort/', { params })
    .then((res) => res.data)
    .catch((err) => console.error(err));
};

export const getGenreMovieList = (genre_id) => {
  return API.get(URL + `genre/${genre_id}/`)
    .then((res) => res.data)
    .catch((err) => console.error(err));
};

export const createMovieReview = (movie_id, data) => {
  return API.post(URL + `review/${movie_id}/`, data)
    .then((res) => res.data)
    .catch((err) => console.error(err));
};
