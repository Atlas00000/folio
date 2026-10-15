import { getCourse } from '@/lib/api/courses';
import { getTopic, listTopics } from '@/lib/api/topics';
import { listMaterials, materialDownloadUrl } from '@/lib/api/materials';
import { listQuestions } from '@/lib/api/questions';
import { myProgress } from '@/lib/api/progress';
import { listAttempts } from '@/lib/api/attempts';
import type { Material, ProgressRow, Question } from '@/lib/types';
import type {
  TopicAttemptPeek,
  TopicHomeData,
  TopicNeighbours,
  TopicReading,
  TopicSignal,
} from './types';

function publishedMaterials(materials: Material[]) {
  return materials.filter((m) => m.status === 'published');
}

function publishedQuestions(questions: Question[]) {
  return questions.filter((q) => !q.status || q.status === 'published');
}

export async function loadTopicHome(
  courseId: string,
  topicId: string,
): Promise<TopicHomeData> {
  const [course, topic, topics, materials, questions, progressRows] =
    await Promise.all([
      getCourse(courseId),
      getTopic(courseId, topicId),
      listTopics(courseId),
      listMaterials(courseId, topicId).catch(() => [] as Material[]),
      listQuestions(courseId, topicId).catch(() => [] as Question[]),
      myProgress(courseId).catch(() => [] as ProgressRow[]),
    ]);

  return {
    course,
    topic,
    topics,
    materials: publishedMaterials(materials),
    questions: publishedQuestions(questions),
    progress: progressRows.find((p) => p.topicId === topicId) ?? null,
  };
}

export function buildTopicSignal(data: TopicHomeData): TopicSignal {
  const attempts = data.progress ? Number(data.progress.attemptsCount) : 0;
  const correct = data.progress ? Number(data.progress.correctCount) : 0;
  const mastery = data.progress ? Number(data.progress.masteryScore) : 0;
  const weak = data.progress?.weak ?? true;

  if (attempts === 0) {
    return {
      signal: 'untried',
      label: 'Untried',
      mastery: 0,
      attempts: 0,
      correct: 0,
    };
  }
  if (weak) {
    return {
      signal: 'weak',
      label: 'Revisit',
      mastery,
      attempts,
      correct,
    };
  }
  return {
    signal: 'reinforce',
    label: 'Solid',
    mastery,
    attempts,
    correct,
  };
}

export function buildNeighbours(data: TopicHomeData): TopicNeighbours {
  const ordered = [...data.topics].sort((a, b) => a.sequence - b.sequence);
  const index = ordered.findIndex((t) => t.id === data.topic.id);
  const prev = index > 0 ? ordered[index - 1] : null;
  const next =
    index >= 0 && index < ordered.length - 1 ? ordered[index + 1] : null;

  return {
    prev: prev
      ? {
          topic: prev,
          href: `/student/courses/${data.course.id}/topics/${prev.id}`,
        }
      : null,
    next: next
      ? {
          topic: next,
          href: `/student/courses/${data.course.id}/topics/${next.id}`,
        }
      : null,
  };
}

export function selectPracticeStart(data: TopicHomeData): {
  question: Question;
  href: string;
} | null {
  const question = data.questions[0] ?? null;
  if (!question) return null;
  return {
    question,
    href: `/student/courses/${data.course.id}/practice/${question.id}?topicId=${data.topic.id}`,
  };
}

function pickReadingMaterial(materials: Material[]): Material | null {
  return (
    materials.find((m) => m.type === 'text_summary' && m.body) ??
    materials.find((m) => m.type === 'text_summary') ??
    materials.find((m) => Boolean(m.body)) ??
    materials[0] ??
    null
  );
}

async function fetchMaterialBody(
  courseId: string,
  material: Material,
): Promise<string | null> {
  if (material.body?.trim()) return material.body;
  if (material.type !== 'text_summary') {
    return null;
  }
  try {
    const res = await fetch(materialDownloadUrl(courseId, material.id), {
      credentials: 'include',
    });
    if (!res.ok) return null;
    const text = await res.text();
    return text.trim() ? text : null;
  } catch {
    return null;
  }
}

export async function loadTopicReading(
  data: TopicHomeData,
): Promise<TopicReading | null> {
  const material = pickReadingMaterial(data.materials);
  if (!material) return null;
  const body = await fetchMaterialBody(data.course.id, material);
  return { material, body };
}

type AttemptRow = {
  id?: string;
  correct?: boolean;
  attemptNumber?: number;
  submittedAt?: string | Date | null;
};

export async function loadRecentAttempts(
  data: TopicHomeData,
): Promise<TopicAttemptPeek[]> {
  const sample = data.questions.slice(0, 5);
  if (sample.length === 0) return [];

  const batches = await Promise.all(
    sample.map(async (q) => {
      try {
        const rows = (await listAttempts(
          data.course.id,
          q.id,
        )) as AttemptRow[];
        const latest = rows[0];
        if (!latest) return null;
        return {
          questionId: q.id,
          prompt: q.prompt,
          correct: Boolean(latest.correct),
          attemptNumber: Number(latest.attemptNumber ?? 1),
          submittedAt: latest.submittedAt
            ? String(latest.submittedAt)
            : null,
          href: `/student/courses/${data.course.id}/practice/${q.id}?topicId=${data.topic.id}`,
        } satisfies TopicAttemptPeek;
      } catch {
        return null;
      }
    }),
  );

  return batches
    .filter((row): row is TopicAttemptPeek => row !== null)
    .sort((a, b) => {
      const ta = a.submittedAt ? Date.parse(a.submittedAt) : 0;
      const tb = b.submittedAt ? Date.parse(b.submittedAt) : 0;
      return tb - ta;
    })
    .slice(0, 5);
}

export function practiceHref(
  courseId: string,
  topicId: string,
  questionId: string,
) {
  return `/student/courses/${courseId}/practice/${questionId}?topicId=${topicId}`;
}
