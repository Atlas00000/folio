import type { CourseRole } from '@/lib/types';

export function labelForCourseRole(role?: CourseRole | string): string | null {
  switch (role) {
    case 'student':
      return 'Student';
    case 'lecturer':
      return 'Lecturer';
    case 'ta':
      return 'Teaching assistant';
    default:
      return role ? String(role) : null;
  }
}
