import { apiGet, apiPost } from './client';

export function askTutor(
  courseId: string,
  input: { questionId?: string; message: string; attemptId?: string },
) {
  return apiPost<{
    reply: string;
    citations: { title: string; locator: string; materialId?: string }[];
    state: string;
    insufficientEvidence?: boolean;
  }>(`/courses/${courseId}/tutor/ask`, input);
}

export function listTutorFlags(courseId: string) {
  return apiGet(`/courses/${courseId}/tutor/flags`);
}

export function previewTutor(
  courseId: string,
  input: { message: string; materialIds?: string[] },
) {
  return apiPost(`/courses/${courseId}/tutor/preview`, input);
}
