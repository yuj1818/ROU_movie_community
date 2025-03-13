import API from './axios';

const URL = 'quiz/';

export const createQuiz = (data) => {
  return API.post(URL, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then((res) => res.data)
    .catch((err) => console.error(err));
};
