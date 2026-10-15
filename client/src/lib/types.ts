export type GlobalRole = 'student' | 'lecturer' | 'ta' | 'admin';

export type User = {
  id: string;
  email: string;
  displayName: string;
  globalRole: GlobalRole;
  status: 'active' | 'disabled' | 'pending';
};

export type CourseRole = 'student' | 'lecturer' | 'ta';

export type Course = {
  id: string;
  code: string;
  title: string;
  term: string;
  description?: string | null;
  joinCode?: string;
  status?: string;
  /** Present on list-from-enrolment responses */
  myRole?: CourseRole | string;
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

/** `/courses/:id/progress/me` topic row */
export type ProgressRow = {
  topicId: string;
  title: string;
  sequence: number;
  attemptsCount: number | string;
  correctCount: number | string;
  masteryScore: number | string;
  weak: boolean;
};

export type ApiErrorBody = {
  message?: string | string[];
  statusCode?: number;
};
