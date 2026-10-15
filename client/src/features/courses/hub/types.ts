import type { Course, ProgressRow, Topic } from '@/lib/types';

export type CourseHubSlice = {
  course: Course;
  topics: Topic[];
  progress: ProgressRow[];
};

export type RecentPracticeItem = {
  course: Course;
  topic: ProgressRow;
  href: string;
};

export type { ContinueTarget } from './continue/continue-types';
