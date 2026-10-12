import { beforeAll, describe, expect, it } from 'vitest';
import {
  DEMO_LECTURER,
  DEMO_STUDENT,
  JOURNAL_QUESTION,
  RIGHT_JOURNAL,
  WRONG_JOURNAL,
  courseCode,
} from '../helpers/fixtures';
import { CookieClient, waitForHealth } from '../helpers/http';

describe('A2 attempts hint retry progress', () => {
  const lecturer = new CookieClient();
  const student = new CookieClient();
  let courseId = '';
  let topicId = '';
  let questionId = '';

  beforeAll(async () => {
    await waitForHealth();
    await lecturer.post('/auth/login', DEMO_LECTURER);
    await student.post('/auth/login', DEMO_STUDENT);

    const course = await lecturer.post('/courses', {
      code: courseCode('AT'),
      title: 'Attempts Suite',
      term: '2026-T1',
    });
    courseId = course.data.id;
    await student.post('/enrolments/join', {
      joinCode: course.data.joinCode,
    });

    const topic = await lecturer.post(`/courses/${courseId}/topics`, {
      title: 'Journal practice',
      sequence: 1,
    });
    topicId = topic.data.id;

    const q = await lecturer.post(
      `/courses/${courseId}/topics/${topicId}/questions`,
      {
        ...JOURNAL_QUESTION,
        prompt: `Attempt suite journal ${courseId}`,
      },
    );
    questionId = q.data.id;
    await lecturer.post(
      `/courses/${courseId}/questions/${questionId}/publish`,
    );
  });

  it('wrong credit → hint → correct retry updates progress', async () => {
    const wrong = await student.post(
      `/courses/${courseId}/questions/${questionId}/attempts`,
      WRONG_JOURNAL,
    );
    expect(wrong.status).toBeGreaterThanOrEqual(200);
    expect(wrong.status).toBeLessThan(300);
    expect(wrong.data.mark.correct).toBe(false);
    expect(
      wrong.data.mark.components.some(
        (c: any) => c.misconceptionTag === 'debit_credit_swap',
      ),
    ).toBe(true);
    expect(wrong.data.next.canRequestHint).toBe(true);

    const hint = await student.post(
      `/courses/${courseId}/questions/${questionId}/attempts/hint`,
    );
    expect(hint.status).toBeGreaterThanOrEqual(200);
    expect(hint.data.hint).toBeTruthy();

    const right = await student.post(
      `/courses/${courseId}/questions/${questionId}/attempts`,
      RIGHT_JOURNAL,
    );
    expect(right.status).toBeGreaterThanOrEqual(200);
    expect(right.data.mark.correct).toBe(true);
    expect(right.data.attempt.attemptNumber).toBe(2);

    const progress = await student.get(`/courses/${courseId}/progress/me`);
    expect(progress.status).toBe(200);
    const row = (progress.data as any[]).find((p) => p.topicId === topicId);
    expect(row).toBeTruthy();
    expect(Number(row.correctCount)).toBeGreaterThanOrEqual(1);
    expect(Number(row.masteryScore)).toBeGreaterThan(0);
  });
});
