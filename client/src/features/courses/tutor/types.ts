import type { Course, Material, ProgressRow, Question, Topic } from '@/lib/types';
import type { ContinueTarget } from '../hub/continue';

export type TutorCitation = {
  title: string;
  locator: string;
  materialId?: string;
};

export type TutorReply = {
  threadId?: string;
  reply: string;
  citations: TutorCitation[];
  state: string;
  insufficientEvidence?: boolean;
};

export type IndexedMaterial = Material & {
  topicId: string;
  topicTitle: string;
  topicSequence: number;
};

export type TutorPageData = {
  course: Course;
  topics: Topic[];
  progress: ProgressRow[];
  materials: IndexedMaterial[];
  continueTarget: ContinueTarget | null;
};

export type TutorContext = {
  topicId: string | null;
  questionId: string | null;
  topic: Topic | null;
  question: Question | null;
};

export type SuggestedPrompt = {
  id: string;
  label: string;
  message: string;
};
