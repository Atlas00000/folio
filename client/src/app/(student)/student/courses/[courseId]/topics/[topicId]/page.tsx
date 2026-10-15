'use client';

import { useParams } from 'next/navigation';
import { TopicHome } from '@/features/courses/topic';

export default function StudentTopicPage() {
  const { courseId, topicId } = useParams<{
    courseId: string;
    topicId: string;
  }>();
  return <TopicHome courseId={courseId} topicId={topicId} />;
}
