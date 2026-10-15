import type { Course, ProgressRow } from '@/lib/types';
import type { MasterySpinePoint } from '../viz';

export type ProgressPageData = {
  course: Course;
  rows: ProgressRow[];
  spine: MasterySpinePoint[];
};

export type ProgressStats = {
  topicCount: number;
  attempted: number;
  weak: number;
  untried: number;
  avgMastery: number;
  totalAttempts: number;
  totalCorrect: number;
};
