import type {
  Course,
  Material,
  ProgressRow,
  Question,
  Topic,
} from '@/lib/types';
import type { ContinueSignal } from '../hub/continue';

export type TopicHomeData = {
  course: Course;
  topic: Topic;
  topics: Topic[];
  materials: Material[];
  questions: Question[];
  progress: ProgressRow | null;
};

export type TopicSignal = {
  signal: ContinueSignal;
  label: string;
  mastery: number;
  attempts: number;
  correct: number;
};

export type TopicNeighbour = {
  topic: Topic;
  href: string;
};

export type TopicNeighbours = {
  prev: TopicNeighbour | null;
  next: TopicNeighbour | null;
};

export type TopicAttemptPeek = {
  questionId: string;
  prompt: string;
  correct: boolean;
  attemptNumber: number;
  submittedAt: string | null;
  href: string;
};

export type TopicReading = {
  material: Material;
  body: string | null;
};
