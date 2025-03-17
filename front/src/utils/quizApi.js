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

export const getQuizData = (params) => {
  return API.get(URL, { params })
    .then((res) => res.data)
    .catch((err) => console.error(err));
};

export const getQuizDetailData = (quiz_id) => {
  return API.get(URL + `${quiz_id}/`)
    .then((res) => res.data)
    .catch((err) => console.error(err));
};
