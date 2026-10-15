import { listCourses } from '@/lib/api/courses';
import { listTopics } from '@/lib/api/topics';
import { myProgress } from '@/lib/api/progress';
import type { Course, ProgressRow, Topic } from '@/lib/types';
import type { CourseHubSlice } from './types';

async function loadSlice(course: Course): Promise<CourseHubSlice> {
  const [topics, progress] = await Promise.all([
    listTopics(course.id).catch(() => [] as Topic[]),
    myProgress(course.id).catch(() => [] as ProgressRow[]),
  ]);
  return { course, topics, progress };
}

export async function loadCoursesHub(): Promise<{
  courses: Course[];
  slices: CourseHubSlice[];
}> {
  const courses = await listCourses();
  const slices = await Promise.all(courses.map(loadSlice));
  return { courses, slices };
}
