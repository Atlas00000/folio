import { getCourse } from '@/lib/api/courses';
import { listTopics, getTopic } from '@/lib/api/topics';
import { myProgress } from '@/lib/api/progress';
import { listMaterials } from '@/lib/api/materials';
import { listQuestions } from '@/lib/api/questions';
import type { Material, ProgressRow, Question, Topic } from '@/lib/types';
import { selectContinueTarget } from '../hub/continue';
import type {
  IndexedMaterial,
  SuggestedPrompt,
  TutorContext,
  TutorPageData,
} from './types';

export async function loadTutorPage(courseId: string): Promise<TutorPageData> {
  const [course, topics, progress] = await Promise.all([
    getCourse(courseId),
    listTopics(courseId),
    myProgress(courseId).catch(() => [] as ProgressRow[]),
  ]);

  const materialBatches = await Promise.all(
    topics.map(async (topic) => {
      const mats = await listMaterials(courseId, topic.id).catch(
        () => [] as Material[],
      );
      return mats
        .filter((m) => m.status === 'published')
        .map(
          (m): IndexedMaterial => ({
            ...m,
            topicId: topic.id,
            topicTitle: topic.title,
            topicSequence: topic.sequence,
          }),
        );
    }),
  );

  const materials = materialBatches.flat();
  const continueTarget = selectContinueTarget([
    { course, topics, progress },
  ]);

  return { course, topics, progress, materials, continueTarget };
}

export async function resolveTutorContext(
  courseId: string,
  topicId: string | null,
  questionId: string | null,
  topics: Topic[],
): Promise<TutorContext> {
  let topic: Topic | null = null;
  let question: Question | null = null;

  if (topicId) {
    topic =
      topics.find((t) => t.id === topicId) ??
      (await getTopic(courseId, topicId).catch(() => null));
  }

  if (questionId && topicId) {
    const qs = await listQuestions(courseId, topicId).catch(
      () => [] as Question[],
    );
    question = qs.find((q) => q.id === questionId) ?? null;
  } else if (questionId && !topicId) {
    // Scan topics for the question (bounded)
    for (const t of topics.slice(0, 12)) {
      const qs = await listQuestions(courseId, t.id).catch(
        () => [] as Question[],
      );
      const hit = qs.find((q) => q.id === questionId);
      if (hit) {
        question = hit;
        topic = t;
        break;
      }
    }
  }

  return {
    topicId: topic?.id ?? topicId,
    questionId,
    topic,
    question,
  };
}

export function buildSuggestedPrompts(data: TutorPageData): SuggestedPrompt[] {
  const prompts: SuggestedPrompt[] = [];
  const ordered = [...data.topics].sort((a, b) => a.sequence - b.sequence);

  for (const topic of ordered.slice(0, 4)) {
    prompts.push({
      id: `topic-${topic.id}`,
      label: `${String(topic.sequence).padStart(2, '0')} ${topic.title}`,
      message: `Using only the published notes for “${topic.title}”, explain the core idea in one short hint I can apply when practising.`,
    });
  }

  const summary = data.materials.find((m) => m.type === 'text_summary');
  if (summary) {
    prompts.push({
      id: `mat-${summary.id}`,
      label: summary.title,
      message: `What should I watch for when applying ideas from “${summary.title}”? Give a hint grounded in that material only.`,
    });
  }

  return prompts.slice(0, 5);
}

export function weakFootholds(data: TutorPageData) {
  return [...data.progress]
    .filter((p) => p.weak || Number(p.attemptsCount) === 0)
    .sort((a, b) => {
      const aUntried = Number(a.attemptsCount) === 0 ? 0 : 1;
      const bUntried = Number(b.attemptsCount) === 0 ? 0 : 1;
      if (aUntried !== bUntried) return aUntried - bUntried;
      return Number(a.masteryScore) - Number(b.masteryScore);
    })
    .slice(0, 4)
    .map((p) => ({
      topicId: p.topicId,
      title: p.title,
      sequence: p.sequence,
      mastery: Number(p.masteryScore),
      attempts: Number(p.attemptsCount),
      weak: p.weak,
      href: `/student/courses/${data.course.id}/topics/${p.topicId}`,
      prompt: `I am stuck on “${p.title}”. Give a hint using only our published materials for that topic — do not invent marks or journal lines.`,
    }));
}

export function materialTopicHref(
  courseId: string,
  material: IndexedMaterial | undefined,
) {
  if (!material) return null;
  return `/student/courses/${courseId}/topics/${material.topicId}`;
}
