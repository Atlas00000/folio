import type { CourseHubSlice, RecentPracticeItem } from './types';

function mastery(row: { masteryScore: number | string }) {
  return Number(row.masteryScore);
}

export { selectContinueTarget } from './continue/selectContinueTarget';

export function selectRecentPractice(
  slices: CourseHubSlice[],
  limit = 3,
): RecentPracticeItem[] {
  const items: RecentPracticeItem[] = [];

  for (const { course, progress } of slices) {
    for (const topic of progress) {
      if (Number(topic.attemptsCount) <= 0) continue;
      items.push({
        course,
        topic,
        href: `/student/courses/${course.id}/topics/${topic.topicId}`,
      });
    }
  }

  return items
    .sort((a, b) => {
      if (a.topic.weak !== b.topic.weak) return a.topic.weak ? -1 : 1;
      return mastery(a.topic) - mastery(b.topic);
    })
    .slice(0, limit);
}
