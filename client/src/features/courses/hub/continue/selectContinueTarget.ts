import type { CourseHubSlice } from '../types';
import type { ContinueSignal, ContinueTarget } from './continue-types';

function masteryOf(row: { masteryScore: number | string }) {
  return Number(row.masteryScore);
}

function signalFor(topic: {
  weak: boolean;
  attemptsCount: number | string;
}): ContinueSignal {
  if (Number(topic.attemptsCount) === 0) return 'untried';
  if (topic.weak) return 'weak';
  return 'reinforce';
}

function reasonFor(
  signal: ContinueSignal,
  mastery: number,
): string {
  switch (signal) {
    case 'untried':
      return 'No marked attempts on this topic yet';
    case 'weak':
      return `Mastery ${mastery.toFixed(0)} — below the 70 threshold`;
    case 'reinforce':
      return `Mastery ${mastery.toFixed(0)} — reinforce while it is fresh`;
  }
}

/**
 * Pick next practice target from real /progress/me rows across enrolments.
 */
export function selectContinueTarget(
  slices: CourseHubSlice[],
): ContinueTarget | null {
  const candidates: ContinueTarget[] = [];

  for (const { course, progress, topics } of slices) {
    if (progress.length === 0) continue;

    const weakAttempted = progress
      .filter((p) => p.weak && Number(p.attemptsCount) > 0)
      .sort((a, b) => masteryOf(a) - masteryOf(b));

    const neverTried = progress
      .filter((p) => Number(p.attemptsCount) === 0)
      .sort((a, b) => a.sequence - b.sequence);

    const byMastery = [...progress].sort(
      (a, b) => masteryOf(a) - masteryOf(b),
    );

    const topic = weakAttempted[0] ?? neverTried[0] ?? byMastery[0];
    if (!topic) continue;

    const meta = topics.find((t) => t.id === topic.topicId);
    const mastery = masteryOf(topic);
    const signal = signalFor(topic);

    candidates.push({
      course,
      topic,
      topicDescription: meta?.description ?? topic.title,
      href: `/student/courses/${course.id}/topics/${topic.topicId}`,
      progressHref: `/student/courses/${course.id}/progress`,
      reason: reasonFor(signal, mastery),
      signal,
      mastery,
      attempts: Number(topic.attemptsCount),
      correct: Number(topic.correctCount),
    });
  }

  if (candidates.length === 0) return null;

  return candidates.sort((a, b) => {
    const order = { untried: 1, weak: 0, reinforce: 2 } as const;
    if (order[a.signal] !== order[b.signal]) {
      return order[a.signal] - order[b.signal];
    }
    return a.mastery - b.mastery;
  })[0];
}
