'use client';

import { useParams } from 'next/navigation';
import { ProgressHome } from '@/features/courses/progress';

export default function ProgressPage() {
  const { courseId } = useParams<{ courseId: string }>();
  return <ProgressHome courseId={courseId} />;
}
