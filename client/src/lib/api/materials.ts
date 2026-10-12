import { API_URL, apiGet, apiPost } from './client';
import type { Material } from '../types';

export function listMaterials(courseId: string, topicId: string) {
  return apiGet<Material[]>(
    `/courses/${courseId}/topics/${topicId}/materials`,
  );
}

export function createMaterial(
  courseId: string,
  topicId: string,
  input: {
    title: string;
    type: string;
    externalUrl?: string;
    body?: string;
    source?: string;
  },
) {
  return apiPost<Material>(
    `/courses/${courseId}/topics/${topicId}/materials`,
    input,
  );
}

export async function uploadMaterialFile(
  courseId: string,
  materialId: string,
  file: File,
) {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(
    `${API_URL}/courses/${courseId}/materials/${materialId}/upload`,
    { method: 'POST', body: form, credentials: 'include' },
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || 'Upload failed');
  }
  return res.json();
}

export function publishMaterial(courseId: string, materialId: string) {
  return apiPost(`/courses/${courseId}/materials/${materialId}/publish`);
}

export function withdrawMaterial(courseId: string, materialId: string) {
  return apiPost(`/courses/${courseId}/materials/${materialId}/withdraw`);
}

export function materialDownloadUrl(courseId: string, materialId: string) {
  return `${API_URL}/courses/${courseId}/materials/${materialId}/download`;
}
