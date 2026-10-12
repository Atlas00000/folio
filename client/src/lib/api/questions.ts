import { apiGet, apiPost } from './client';
import type { Question } from '../types';

export function listQuestions(courseId: string, topicId: string) {
  return apiGet<Question[]>(
    `/courses/${courseId}/topics/${topicId}/questions`,
  );
}

export function createQuestion(
  courseId: string,
  topicId: string,
  input: Record<string, unknown>,
) {
  return apiPost<Question>(
    `/courses/${courseId}/topics/${topicId}/questions`,
    input,
  );
}

export function publishQuestion(courseId: string, questionId: string) {
  return apiPost(`/courses/${courseId}/questions/${questionId}/publish`);
}

export function previewQuestionCsv(
  courseId: string,
  topicId: string,
  csv: string,
) {
  return apiPost(
    `/courses/${courseId}/topics/${topicId}/questions/import/preview`,
    { csv },
  );
}

export function commitQuestionCsv(
  courseId: string,
  topicId: string,
  csv: string,
) {
  return apiPost(
    `/courses/${courseId}/topics/${topicId}/questions/import/commit`,
    { csv, confirm: true },
  );
}
