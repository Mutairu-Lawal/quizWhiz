export type QuestionType = {
  id: string;
  questionTag: string;
  options: {
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
  };
  optionId: {
    optionAId: string;
    optionBId: string;
    optionCId: string;
    optionDId: string;
  };
  hasView: boolean;
  choice: undefined | string;
  answerId: string;
  feedback: string;
};

export interface UserData {
  name: string;
  Question: Array<QuestionType>;
  correct: [];
  incorrect: [];
  unanswered: [];
  grade: string;
  Comment: string;
  time: undefined | string;
  'new-subject': string;
}
