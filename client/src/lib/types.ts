export type GlobalRole = 'student' | 'lecturer' | 'ta' | 'admin';

export type User = {
  id: string;
  email: string;
  displayName: string;
  globalRole: GlobalRole;
  status: 'active' | 'disabled' | 'pending';
};

export type Course = {
  id: string;
  code: string;
  title: string;
  term: string;
  description?: string | null;
  joinCode?: string;
  status?: string;
};

export type Topic = {
  id: string;
  courseId: string;
  title: string;
  sequence: number;
  description?: string | null;
};

export type Material = {
  id: string;
  topicId: string;
  title: string;
  type: string;
  status: string;
  version?: number;
  externalUrl?: string | null;
  body?: string | null;
};

export type Question = {
  id: string;
  topicId: string;
  type: 'mcq' | 'numerical' | 'journal';
  prompt: string;
  difficulty?: string;
  marks?: string;
  status?: string;
  options?: { id: string; label: string }[];
  hints?: string[];
};

export type JournalLine = {
  account: string;
  direction: 'debit' | 'credit';
  amount: string;
};

export type MarkResult = {
  correct: boolean;
  score: string;
  feedback: string[];
  components: { misconceptionTag?: string | null }[];
};

export type AttemptSubmitResponse = {
  attempt: { id: string; attemptNumber: number; correct: boolean };
  mark: MarkResult;
  next: { canRequestHint: boolean; canRetry: boolean; canReveal: boolean };
};

export type ProgressRow = {
  topicId: string;
  topicTitle?: string;
  attemptCount: number | string;
  correctCount: number | string;
  masteryScore: number | string;
};

export type ApiErrorBody = {
  message?: string | string[];
  statusCode?: number;
};
