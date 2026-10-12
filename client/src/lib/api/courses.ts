import { apiGet, apiPatch, apiPost } from './client';
import type { Course } from '../types';

export function listCourses() {
  return apiGet<Course[]>('/courses');
}

export function getCourse(courseId: string) {
  return apiGet<Course>(`/courses/${courseId}`);
}

export function createCourse(input: {
  code: string;
  title: string;
  term: string;
  description?: string;
}) {
  return apiPost<Course>('/courses', input);
}

export function updateCourse(
  courseId: string,
  input: Partial<{ title: string; description: string; status: string }>,
) {
  return apiPatch<Course>(`/courses/${courseId}`, input);
}
