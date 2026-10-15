'use client';

import { Suspense } from 'react';
import { useParams } from 'next/navigation';
import { TutorHome } from '@/features/courses/tutor';
import { Skeleton } from '@/design/patterns';

export default function StudentTutorPage() {
  const { courseId } = useParams<{ courseId: string }>();
  return (
    <Suspense
      fallback={
        <div className="space-y-6" aria-busy="true">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-40 w-full" />
        </div>
      }
    >
      <TutorHome courseId={courseId} />
    </Suspense>
  );
}
