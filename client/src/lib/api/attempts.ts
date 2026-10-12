import { apiGet, apiPost } from './client';
import type { AttemptSubmitResponse, JournalLine } from '../types';

export function submitAttempt(
  courseId: string,
  questionId: string,
  body: {
    selectedOptionId?: string;
    value?: string;
    lines?: JournalLine[];
  },
) {
  return apiPost<AttemptSubmitResponse>(
    `/courses/${courseId}/questions/${questionId}/attempts`,
    body,
  );
}

export function listAttempts(courseId: string, questionId: string) {
  return apiGet(`/courses/${courseId}/questions/${questionId}/attempts`);
}

export function requestHint(courseId: string, questionId: string) {
  return apiPost<{ hint: string }>(
    `/courses/${courseId}/questions/${questionId}/attempts/hint`,
  );
}

export function revealAnswer(courseId: string, questionId: string) {
  return apiPost(
    `/courses/${courseId}/questions/${questionId}/attempts/reveal`,
  );
}
