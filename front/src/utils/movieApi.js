import API from './axios';

const URL = 'movies/';

export const getTrendMovieList = () => {
  return API.get(URL + 'trends/')
    .then((res) => res.data)
    .catch((err) => console.error(err));
};
