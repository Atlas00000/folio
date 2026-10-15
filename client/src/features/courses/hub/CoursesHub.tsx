'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/features/auth/AuthProvider';
import { CourseLedger } from '@/features/courses';
import { PageHeader } from '@/design/shells';
import { ErrorNote } from '@/components/ui';
import { SkeletonPage } from '@/design/patterns';
import type { Course } from '@/lib/types';
import type { CourseHubSlice } from './types';
import { loadCoursesHub } from './loadCoursesHub';
import { selectContinueTarget, selectRecentPractice } from './selectContinue';
import { buildPortfolioStrip } from './buildPortfolioStrip';
import { hubDescription, hubGreeting } from './greeting';
import { SessionLine } from './SessionLine';
import { JoinRail } from './JoinRail';
import { TopicFootholds } from './TopicFootholds';
import { ContinuePractising } from './continue';
import { RecentPracticeStrip } from './RecentPracticeStrip';

const PortfolioMasteryStrip = dynamic(
  () => import('../viz').then((m) => m.PortfolioMasteryStrip),
  { ssr: false },
);

export function CoursesHub() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [slices, setSlices] = useState<CourseHubSlice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCoursesHub()
      .then(({ courses: c, slices: s }) => {
        setCourses(c);
        setSlices(s);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, []);

  const continueTarget = useMemo(
    () => selectContinueTarget(slices),
    [slices],
  );
  const recent = useMemo(() => selectRecentPractice(slices), [slices]);
  const portfolio = useMemo(() => buildPortfolioStrip(slices), [slices]);

  const greeting = user ? hubGreeting(user.displayName) : 'Your courses';

  if (loading) {
    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow="Student"
          title={greeting}
          description="Loading your enrolments and practice signals…"
        />
        <SkeletonPage />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Your ledger"
        title={greeting}
        description={hubDescription(courses.length)}
      />

      {user ? (
        <SessionLine
          displayName={user.displayName}
          email={user.email}
          globalRole={user.globalRole}
          courses={courses}
        />
      ) : null}

      <ErrorNote>{error}</ErrorNote>

      {portfolio.length > 0 ? (
        <PortfolioMasteryStrip points={portfolio} />
      ) : null}

      <CourseLedger
        courses={courses}
        loading={false}
        ownerName={user?.displayName}
        hrefFor={(c) => `/student/courses/${c.id}`}
      />

      <ContinuePractising target={continueTarget} />

      <TopicFootholds slices={slices} />

      <RecentPracticeStrip items={recent} />

      <JoinRail />
    </div>
  );
}
