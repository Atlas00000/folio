import { getCourse } from '@/lib/api/courses';
import { myProgress } from '@/lib/api/progress';
import type { MasterySpinePoint } from '../viz';
import type { ProgressPageData, ProgressStats } from './types';

export function rowsToSpine(
  courseId: string,
  rows: ProgressPageData['rows'],
): MasterySpinePoint[] {
  return [...rows]
    .sort((a, b) => a.sequence - b.sequence)
    .map((r) => {
      const attempts = Number(r.attemptsCount);
      const correct = Number(r.correctCount);
      const mastery = Number(r.masteryScore);
      return {
        topicId: r.topicId,
        sequence: r.sequence,
        title: r.title,
        mastery,
        attempts,
        correct,
        weak: Boolean(r.weak),
        href: `/student/courses/${courseId}/topics/${r.topicId}`,
      };
    });
}

export async function loadProgressPage(
  courseId: string,
): Promise<ProgressPageData> {
  const [course, rows] = await Promise.all([
    getCourse(courseId),
    myProgress(courseId),
  ]);
  return {
    course,
    rows,
    spine: rowsToSpine(courseId, rows),
  };
}

export function buildProgressStats(spine: MasterySpinePoint[]): ProgressStats {
  let attempted = 0;
  let weak = 0;
  let untried = 0;
  let masterySum = 0;
  let masteryN = 0;
  let totalAttempts = 0;
  let totalCorrect = 0;

  for (const p of spine) {
    totalAttempts += p.attempts;
    totalCorrect += p.correct;
    if (p.attempts === 0) {
      untried += 1;
      continue;
    }
    attempted += 1;
    masterySum += p.mastery;
    masteryN += 1;
    if (p.weak) weak += 1;
  }

  return {
    topicCount: spine.length,
    attempted,
    weak,
    untried,
    avgMastery: masteryN ? masterySum / masteryN : 0,
    totalAttempts,
    totalCorrect,
  };
}
