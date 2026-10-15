import type { CourseHomeData } from '../home/types';
import type { MasterySpinePoint } from './MasterySpine';

export function buildMasterySpinePoints(
  data: CourseHomeData,
): MasterySpinePoint[] {
  const byId = new Map(data.progress.map((p) => [p.topicId, p]));

  return [...data.topics]
    .sort((a, b) => a.sequence - b.sequence)
    .map((topic) => {
      const p = byId.get(topic.id);
      const attempts = p ? Number(p.attemptsCount) : 0;
      const correct = p ? Number(p.correctCount) : 0;
      const mastery = p ? Number(p.masteryScore) : 0;
      const weak = p ? Boolean(p.weak) : true;
      return {
        topicId: topic.id,
        sequence: topic.sequence,
        title: topic.title,
        mastery,
        attempts,
        correct,
        weak,
        href: `/student/courses/${data.course.id}/topics/${topic.id}`,
      };
    });
}
