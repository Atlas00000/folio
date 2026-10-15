'use client';

import { useParams } from 'next/navigation';
import { CourseHome } from '@/features/courses/home';

export default function StudentCoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  return <CourseHome courseId={courseId} />;
}
