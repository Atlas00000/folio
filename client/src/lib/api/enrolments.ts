import { apiGet, apiPost } from './client';

export function joinCourse(joinCode: string) {
  return apiPost('/enrolments/join', { joinCode });
}

export function listEnrolments(courseId: string) {
  return apiGet(`/courses/${courseId}/enrolments`);
}

export function withdrawEnrolment(courseId: string, userId: string) {
  return apiPost(`/courses/${courseId}/enrolments/withdraw`, { userId });
}
