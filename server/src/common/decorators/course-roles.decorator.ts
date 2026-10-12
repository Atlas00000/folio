import { SetMetadata } from '@nestjs/common';

export const COURSE_ROLES_KEY = 'course_roles';
export type CourseRoleName = 'student' | 'lecturer' | 'ta';

/** Roles allowed on the course for this route (admin always allowed). */
export const CourseRoles = (...roles: CourseRoleName[]) =>
  SetMetadata(COURSE_ROLES_KEY, roles);
