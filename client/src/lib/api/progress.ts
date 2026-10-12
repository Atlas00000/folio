import { API_URL, apiGet } from './client';
import type { ProgressRow } from '../types';

export function myProgress(courseId: string) {
  return apiGet<ProgressRow[]>(`/courses/${courseId}/progress/me`);
}

export function courseAnalytics(courseId: string) {
  return apiGet(`/courses/${courseId}/analytics`);
}

export function analyticsCsvUrl(courseId: string) {
  return `${API_URL}/courses/${courseId}/analytics.csv`;
}
