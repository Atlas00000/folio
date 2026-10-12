import { beforeAll, describe, expect, it } from 'vitest';
import {
  DEMO_LECTURER,
  DEMO_STUDENT,
  JOURNAL_QUESTION,
  WRONG_JOURNAL,
  courseCode,
} from '../helpers/fixtures';
import { CookieClient, waitForHealth } from '../helpers/http';

describe('A2 lecturer analytics', () => {
  const lecturer = new CookieClient();
  const student = new CookieClient();
  let courseId = '';

  beforeAll(async () => {
    await waitForHealth();
    await lecturer.post('/auth/login', DEMO_LECTURER);
    await student.post('/auth/login', DEMO_STUDENT);

    const course = await lecturer.post('/courses', {
      code: courseCode('AN'),
      title: 'Analytics Suite',
      term: '2026-T1',
    });
    courseId = course.data.id;
    await student.post('/enrolments/join', {
      joinCode: course.data.joinCode,
    });

    const topic = await lecturer.post(`/courses/${courseId}/topics`, {
      title: 'Analytics topic',
      sequence: 1,
    });
    const q = await lecturer.post(
      `/courses/${courseId}/topics/${topic.data.id}/questions`,
      {
        ...JOURNAL_QUESTION,
        prompt: `Analytics journal ${courseId}`,
      },
    );
    await lecturer.post(
      `/courses/${courseId}/questions/${q.data.id}/publish`,
    );
    await student.post(
      `/courses/${courseId}/questions/${q.data.id}/attempts`,
      WRONG_JOURNAL,
    );
  });

  it('returns struggle-by-topic JSON', async () => {
    const { status, data } = await lecturer.get(
      `/courses/${courseId}/analytics`,
    );
    expect(status).toBe(200);
    expect(data.courseId).toBe(courseId);
    expect(Array.isArray(data.topicsByStruggle)).toBe(true);
    expect(data.topicsByStruggle.length).toBeGreaterThan(0);
    expect(data.activeStudents).toBeGreaterThanOrEqual(1);
  });

  it('returns CSV export', async () => {
    const { status, data } = await lecturer.get(
      `/courses/${courseId}/analytics.csv`,
    );
    expect(status).toBe(200);
    const text = typeof data === 'string' ? data : String(data);
    expect(text).toMatch(/topicId,title/);
    expect(text.split('\n').length).toBeGreaterThan(1);
  });
});
