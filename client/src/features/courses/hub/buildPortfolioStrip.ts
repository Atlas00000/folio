import type { CourseHubSlice } from './types';

export type PortfolioStripPoint = {
  courseId: string;
  code: string;
  title: string;
  term: string;
  href: string;
  topicCount: number;
  attempted: number;
  weak: number;
  untried: number;
  avgMastery: number;
  totalAttempts: number;
  /** untried = no attempts anywhere; weak = any weak attempted; else solid */
  signal: 'untried' | 'weak' | 'solid';
};

export function buildPortfolioStrip(
  slices: CourseHubSlice[],
): PortfolioStripPoint[] {
  return slices
    .map(({ course, progress, topics }) => {
      const topicCount = Math.max(topics.length, progress.length);
      let attempted = 0;
      let weak = 0;
      let untried = 0;
      let masterySum = 0;
      let masteryN = 0;
      let totalAttempts = 0;

      const rows =
        progress.length > 0
          ? progress
          : topics.map((t) => ({
              topicId: t.id,
              title: t.title,
              sequence: t.sequence,
              attemptsCount: 0,
              correctCount: 0,
              masteryScore: 0,
              weak: true,
            }));

      for (const p of rows) {
        const attempts = Number(p.attemptsCount);
        totalAttempts += attempts;
        if (attempts === 0) {
          untried += 1;
          continue;
        }
        attempted += 1;
        masterySum += Number(p.masteryScore);
        masteryN += 1;
        if (p.weak) weak += 1;
      }

      // If we only have course list with empty progress fetch fail, still show bar
      if (rows.length === 0 && topicCount === 0) {
        untried = 0;
      }

      const avgMastery = masteryN ? masterySum / masteryN : 0;
      const signal: PortfolioStripPoint['signal'] =
        totalAttempts === 0 ? 'untried' : weak > 0 ? 'weak' : 'solid';

      return {
        courseId: course.id,
        code: course.code,
        title: course.title,
        term: course.term,
        href: `/student/courses/${course.id}`,
        topicCount: topicCount || rows.length,
        attempted,
        weak,
        untried,
        avgMastery,
        totalAttempts,
        signal,
      };
    })
    .sort((a, b) => a.code.localeCompare(b.code));
}
