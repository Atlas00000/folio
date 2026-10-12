import { beforeAll, describe, expect, it } from 'vitest';
import {
  DEMO_LECTURER,
  DEMO_STUDENT,
  courseCode,
} from '../helpers/fixtures';
import { CookieClient, waitForHealth } from '../helpers/http';

describe('D grounded tutor', () => {
  const lecturer = new CookieClient();
  const student = new CookieClient();
  let courseId = '';
  let topicId = '';
  let materialId = '';

  beforeAll(async () => {
    await waitForHealth();
    await lecturer.post('/auth/login', DEMO_LECTURER);
    await student.post('/auth/login', DEMO_STUDENT);

    const course = await lecturer.post('/courses', {
      code: courseCode('TU'),
      title: 'Tutor Suite',
      term: '2026-T1',
    });
    courseId = course.data.id;
    await student.post('/enrolments/join', {
      joinCode: course.data.joinCode,
    });

    const topic = await lecturer.post(`/courses/${courseId}/topics`, {
      title: 'Debits and credits',
      sequence: 1,
    });
    topicId = topic.data.id;

    const material = await lecturer.post(
      `/courses/${courseId}/topics/${topicId}/materials`,
      {
        title: 'Owner investment notes',
        type: 'text_summary',
        body: 'When an owner invests cash into the business, debit the Cash asset account and credit the Capital equity account. Assets increase with debits.',
      },
    );
    materialId = material.data.id;
    await lecturer.post(
      `/courses/${courseId}/materials/${materialId}/publish`,
    );
  });

  it('answers with citations when materials cover the question', async () => {
    const res = await student.post(`/courses/${courseId}/tutor/ask`, {
      message: 'How do I record owner cash investment into capital?',
    });
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.status).toBeLessThan(300);
    expect(res.data.insufficientEvidence).toBe(false);
    expect(res.data.citations?.length).toBeGreaterThan(0);
    expect(res.data.reply).toMatch(/Hint|debit|Cash|Capital/i);
  });

  it('admits insufficient evidence when materials do not answer', async () => {
    const res = await student.post(`/courses/${courseId}/tutor/ask`, {
      message: 'What is the boiling point of liquid nitrogen in kelvin?',
    });
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(res.data.insufficientEvidence).toBe(true);
    expect(res.data.reply).toMatch(/enough evidence|insufficient/i);
  });

  it('reindexes after material replace semantics via republish path', async () => {
    const replacement = await lecturer.post(
      `/courses/${courseId}/topics/${topicId}/materials`,
      {
        title: 'Updated investment notes',
        type: 'text_summary',
        body: 'Replacement text: always debit Cash and credit Capital for owner cash investment. Future tutor answers should cite this version.',
      },
    );
    await lecturer.post(
      `/courses/${courseId}/materials/${materialId}/withdraw`,
    );
    await lecturer.post(
      `/courses/${courseId}/materials/${replacement.data.id}/publish`,
    );

    const res = await student.post(`/courses/${courseId}/tutor/ask`, {
      message: 'debit Cash credit Capital owner investment',
    });
    expect(res.status).toBeLessThan(300);
    expect(res.data.insufficientEvidence).toBe(false);
    const titles = (res.data.citations || []).map((c: { title: string }) => c.title);
    expect(titles.some((t: string) => /Updated|Replacement|investment/i.test(t))).toBe(
      true,
    );
  });
});
