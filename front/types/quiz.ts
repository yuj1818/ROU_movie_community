export interface QuizItem {
  id: number;
  choice_text: string;
}

export interface Quiz {
  id: number;
  quiz_writor: {
    id: number;
    username: string;
  };
  items: QuizItem[];
  question: string;
  quiz_image: string;
}
