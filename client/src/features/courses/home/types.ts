import type { Course, Material, ProgressRow, Question, Topic } from '@/lib/types';
import type { ContinueTarget } from '../hub/continue';

export type CourseHomeData = {
  course: Course;
  topics: Topic[];
  progress: ProgressRow[];
};

export type CourseProgressStats = {
  topicCount: number;
  attempted: number;
  weak: number;
  untried: number;
  avgMastery: number;
};

export type TopicLedgerRow = {
  topic: Topic;
  progress: ProgressRow | null;
  href: string;
};

export type CourseHomePeeks = {
  continueTarget: ContinueTarget | null;
  materials: Material[];
  question: Question | null;
  questionHref: string | null;
};
