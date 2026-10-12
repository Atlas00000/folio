import { beforeAll, describe, expect, it } from 'vitest';
import {
  DEMO_LECTURER,
  DEMO_STUDENT,
  courseCode,
  uniEmail,
} from '../helpers/fixtures';
import { CookieClient, waitForHealth } from '../helpers/http';

describe('A1 courses & enrolment', () => {
  const lecturer = new CookieClient();
  const student = new CookieClient();
  let courseId = '';
  let joinCode = '';

  beforeAll(async () => {
    await waitForHealth();
    await lecturer.post('/auth/login', DEMO_LECTURER);
    await student.post('/auth/login', DEMO_STUDENT);
  });

  it('lecturer creates a course', async () => {
    const code = courseCode('C');
    const { status, data } = await lecturer.post('/courses', {
      code,
      title: `Test ${code}`,
      term: '2026-T1',
      description: 'A1 suite course',
    });
    expect(status).toBeGreaterThanOrEqual(200);
    expect(status).toBeLessThan(300);
    expect(data.code).toBe(code);
    expect(data.joinCode).toBeTruthy();
    courseId = data.id;
    joinCode = data.joinCode;
  });

  it('student joins by code and can list course', async () => {
    const join = await student.post('/enrolments/join', { joinCode });
    expect(join.status).toBeGreaterThanOrEqual(200);
    expect(join.status).toBeLessThan(300);
    expect(join.data.course.id).toBe(courseId);

    const get = await student.get(`/courses/${courseId}`);
    expect(get.status).toBe(200);
    expect(get.data.id).toBe(courseId);
  });

  it('denies access to a non-existent / other course', async () => {
    const { status } = await student.get(
      '/courses/00000000-0000-0000-0000-000000000001',
    );
    expect([403, 404]).toContain(status);
  });

  it('rejects student creating courses', async () => {
    const outsider = new CookieClient();
    const email = uniEmail('studcreate');
    await outsider.post('/auth/register', {
      email,
      displayName: 'Student Only',
      password: 'password123',
    });
    const { status } = await outsider.post('/courses', {
      code: courseCode('S'),
      title: 'Should Fail',
      term: '2026-T1',
    });
    expect(status).toBe(403);
  });
});
