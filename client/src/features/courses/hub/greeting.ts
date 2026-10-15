import type { GlobalRole } from '@/lib/types';

/** First token of display name for greetings. */
export function firstName(displayName: string): string {
  const trimmed = displayName.trim();
  if (!trimmed) return 'there';
  return trimmed.split(/\s+/)[0] ?? trimmed;
}

export function roleLabel(role: GlobalRole | string): string {
  switch (role) {
    case 'student':
      return 'Student';
    case 'lecturer':
      return 'Lecturer';
    case 'ta':
      return 'Teaching assistant';
    case 'admin':
      return 'Admin';
    default:
      return String(role);
  }
}

export function hubGreeting(displayName: string): string {
  const name = displayName.trim() || 'there';
  return `Hi, ${name}`;
}

export function hubDescription(courseCount: number): string {
  if (courseCount === 0) {
    return 'You have no enrolments yet. Join a course with your lecturer’s code to start practising.';
  }
  if (courseCount === 1) {
    return 'You are enrolled in 1 course. Open it to study materials, practise, and track progress.';
  }
  return `You are enrolled in ${courseCount} courses. Open one to study materials, practise, and track progress.`;
}
