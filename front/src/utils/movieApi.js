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
