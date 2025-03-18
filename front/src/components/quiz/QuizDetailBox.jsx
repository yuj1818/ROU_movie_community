import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getQuizDetailData } from '../../utils/quizAPI';
import LazyImg from '../common/LazyImg';
import QuizItemBox from './QuizItemBox';

const QuizDetailBox = () => {
  const { quizIdx, quizIds } = useSelector((state) => state.quiz);
  const [quizData, setQuizData] = useState();

  useEffect(() => {
    if (!quizIds) return;
    const getQuizData = async () => {
      const res = await getQuizDetailData(quizIds[quizIdx]);
      setQuizData(res);
    };

    getQuizData();
  }, [quizIdx]);

  return (
    quizData && (
      <div className="text-white w-4/5 flex flex-col gap-4 items-center justify-center">
        <h3 className="font-pretendard_semibold text-2xl">
          {quizData.question}
        </h3>
        <div className="w-2/3 max-w-[25rem] aspect-video rounded-sm overflow-hidden">
          <LazyImg src={quizData.quiz_image} className="w-full h-full" />
        </div>
        <div className="flex max-w-[25rem] flex-col w-2/3 gap-2">
          {quizData.items.map((item) => (
            <QuizItemBox key={item.id} data={item} />
          ))}
        </div>
      </div>
    )
  );
};

export default QuizDetailBox;
