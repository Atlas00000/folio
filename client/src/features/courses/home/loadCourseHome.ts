import { getCourse } from '@/lib/api/courses';
import { listTopics } from '@/lib/api/topics';
import { myProgress } from '@/lib/api/progress';
import { listMaterials } from '@/lib/api/materials';
import { listQuestions } from '@/lib/api/questions';
import type { Material, ProgressRow, Question, Topic } from '@/lib/types';
import type { ContinueTarget } from '../hub/continue';
import { selectContinueTarget } from '../hub/continue';
import type {
  CourseHomeData,
  CourseHomePeeks,
  CourseProgressStats,
  TopicLedgerRow,
} from './types';

export async function loadCourseHome(courseId: string): Promise<CourseHomeData> {
  const [course, topics, progress] = await Promise.all([
    getCourse(courseId),
    listTopics(courseId),
    myProgress(courseId).catch(() => [] as ProgressRow[]),
  ]);
  return { course, topics, progress };
}

export function buildTopicLedgerRows(data: CourseHomeData): TopicLedgerRow[] {
  return [...data.topics]
    .sort((a, b) => a.sequence - b.sequence)
    .map((topic) => ({
      topic,
      progress: data.progress.find((p) => p.topicId === topic.id) ?? null,
      href: `/student/courses/${data.course.id}/topics/${topic.id}`,
    }));
}

export function buildProgressStats(data: CourseHomeData): CourseProgressStats {
  const topicCount = data.topics.length;
  const byId = new Map(data.progress.map((p) => [p.topicId, p]));
  let attempted = 0;
  let weak = 0;
  let untried = 0;
  let masterySum = 0;
  let masteryN = 0;

  for (const topic of data.topics) {
    const p = byId.get(topic.id);
    const attempts = p ? Number(p.attemptsCount) : 0;
    if (!p || attempts === 0) {
      untried += 1;
      continue;
    }
    attempted += 1;
    masterySum += Number(p.masteryScore);
    masteryN += 1;
    if (p.weak) weak += 1;
  }

  return {
    topicCount,
    attempted,
    weak,
    untried,
    avgMastery: masteryN ? masterySum / masteryN : 0,
  };
}

export function selectCourseContinue(
  data: CourseHomeData,
): ContinueTarget | null {
  const fromProgress = selectContinueTarget([
    {
      course: data.course,
      topics: data.topics,
      progress: data.progress,
    },
  ]);
  if (fromProgress) return fromProgress;

  const topic = firstTopic(data.topics);
  if (!topic) return null;

  return {
    course: data.course,
    topic: {
      topicId: topic.id,
      title: topic.title,
      sequence: topic.sequence,
      attemptsCount: 0,
      correctCount: 0,
      masteryScore: 0,
      weak: true,
    },
    topicDescription: topic.description ?? topic.title,
    href: `/student/courses/${data.course.id}/topics/${topic.id}`,
    progressHref: `/student/courses/${data.course.id}/progress`,
    reason: 'First topic in this module',
    signal: 'untried',
    mastery: 0,
    attempts: 0,
    correct: 0,
  };
}

export async function loadCoursePeeks(
  data: CourseHomeData,
): Promise<CourseHomePeeks> {
  const continueTarget = selectCourseContinue(data);
  if (!continueTarget) {
    return {
      continueTarget: null,
      materials: [],
      question: null,
      questionHref: null,
    };
  }

  const topicId = continueTarget.topic.topicId;
  const [materials, questions] = await Promise.all([
    listMaterials(data.course.id, topicId).catch(() => [] as Material[]),
    listQuestions(data.course.id, topicId).catch(() => [] as Question[]),
  ]);

  const publishedMats = materials.filter((m) => m.status === 'published');
  const question =
    questions.find((q) => q.status === 'published') ?? questions[0] ?? null;

  return {
    continueTarget,
    materials: publishedMats.slice(0, 3),
    question,
    questionHref: question
      ? `/student/courses/${data.course.id}/practice/${question.id}`
      : null,
  };
}

export function firstTopic(topics: Topic[]): Topic | null {
  return [...topics].sort((a, b) => a.sequence - b.sequence)[0] ?? null;
}
