export type ComponentMark = {
  component: 'account' | 'direction' | 'amount' | 'choice' | 'value' | 'overall';
  correct: boolean;
  detail?: string;
  misconceptionTag?: string;
};

export type MarkResult = {
  correct: boolean;
  score: string;
  maxScore: string;
  components: ComponentMark[];
  feedback: string[];
  suggestedHintIndex?: number;
};

export type McqResponse = { selectedOptionId: string };
export type NumericalResponse = { value: string };
export type JournalLineResponse = {
  account: string;
  direction: 'debit' | 'credit';
  amount: string;
};
export type JournalResponse = { lines: JournalLineResponse[] };

export type AttemptResponse =
  | McqResponse
  | NumericalResponse
  | JournalResponse;
