import { apiGet, apiPost } from './client';
import type { Topic } from '../types';

export function listTopics(courseId: string) {
  return apiGet<Topic[]>(`/courses/${courseId}/topics`);
}

export function getTopic(courseId: string, topicId: string) {
  return apiGet<Topic>(`/courses/${courseId}/topics/${topicId}`);
}

export function createTopic(
  courseId: string,
  input: { title: string; sequence?: number; description?: string },
) {
  return apiPost<Topic>(`/courses/${courseId}/topics`, input);
}
