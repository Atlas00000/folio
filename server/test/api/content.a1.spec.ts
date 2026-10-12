import { beforeAll, describe, expect, it } from 'vitest';
import {
  DEMO_LECTURER,
  DEMO_STUDENT,
  JOURNAL_QUESTION,
  courseCode,
} from '../helpers/fixtures';
import { CookieClient, waitForHealth } from '../helpers/http';

describe('A1 content publish visibility', () => {
  const lecturer = new CookieClient();
  const student = new CookieClient();
  let courseId = '';
  let topicId = '';
  let materialId = '';
  let questionId = '';

  beforeAll(async () => {
    await waitForHealth();
    await lecturer.post('/auth/login', DEMO_LECTURER);
    await student.post('/auth/login', DEMO_STUDENT);

    const course = await lecturer.post('/courses', {
      code: courseCode('CT'),
      title: 'Content Suite Course',
      term: '2026-T1',
    });
    courseId = course.data.id;

    await student.post('/enrolments/join', {
      joinCode: course.data.joinCode,
    });

    const topic = await lecturer.post(`/courses/${courseId}/topics`, {
      title: 'Visibility topic',
      sequence: 1,
      outcomes: [{ description: 'See published items only' }],
    });
    topicId = topic.data.id;
  });

  it('lecturer creates unpublished material then publishes', async () => {
    const created = await lecturer.post(
      `/courses/${courseId}/topics/${topicId}/materials`,
      {
        title: 'Draft notes',
        type: 'text_summary',
        body: 'Assets = Liabilities + Equity',
        licence: 'course',
      },
    );
    expect(created.status).toBeGreaterThanOrEqual(200);
    expect(created.status).toBeLessThan(300);
    expect(created.data.status).toBe('unpublished');
    materialId = created.data.id;

    const before = await student.get(
      `/courses/${courseId}/topics/${topicId}/materials`,
    );
    expect(before.status).toBe(200);
    expect(
      (before.data as any[]).some((m) => m.id === materialId),
    ).toBe(false);

    const pub = await lecturer.post(
      `/courses/${courseId}/materials/${materialId}/publish`,
    );
    expect(pub.status).toBeGreaterThanOrEqual(200);
    expect(pub.data.status).toBe('published');

    const after = await student.get(
      `/courses/${courseId}/topics/${topicId}/materials`,
    );
    expect(
      (after.data as any[]).some((m) => m.id === materialId && m.status === 'published'),
    ).toBe(true);
  });

  it('student sees published question without answer key', async () => {
    const created = await lecturer.post(
      `/courses/${courseId}/topics/${topicId}/questions`,
      {
        ...JOURNAL_QUESTION,
        prompt: `${JOURNAL_QUESTION.prompt} [${courseId}]`,
      },
    );
    expect(created.status).toBeGreaterThanOrEqual(200);
    questionId = created.data.id;

    await lecturer.post(
      `/courses/${courseId}/questions/${questionId}/publish`,
    );

    const list = await student.get(
      `/courses/${courseId}/topics/${topicId}/questions`,
    );
    expect(list.status).toBe(200);
    const q = (list.data as any[]).find((row) => row.id === questionId);
    expect(q).toBeTruthy();
    expect(q.acceptedSolutions).toBeUndefined();
    expect(q.prompt).toBeTruthy();
  });
});
