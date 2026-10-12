'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getTopic } from '@/lib/api/topics';
import {
  createMaterial,
  listMaterials,
  publishMaterial,
  uploadMaterialFile,
  withdrawMaterial,
} from '@/lib/api/materials';
import {
  commitQuestionCsv,
  createQuestion,
  listQuestions,
  previewQuestionCsv,
  publishQuestion,
} from '@/lib/api/questions';
import type { Material, Question, Topic } from '@/lib/types';
import {
  Button,
  Empty,
  ErrorNote,
  Field,
  Panel,
  Select,
  TextArea,
} from '@/components/ui';

export default function LecturerTopicPage() {
  const { courseId, topicId } = useParams<{
    courseId: string;
    topicId: string;
  }>();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState('');
  const [csvPreview, setCsvPreview] = useState<unknown>(null);
  const [csvText, setCsvText] = useState(
    'type,prompt,marks,mcqCorrectOptionId,options,numericalValue\nmcq,What increases with a debit to cash?,1,a,"a:Cash asset;b:Liability",\n',
  );

  async function reload() {
    const [t, m, q] = await Promise.all([
      getTopic(courseId, topicId),
      listMaterials(courseId, topicId),
      listQuestions(courseId, topicId),
    ]);
    setTopic(t);
    setMaterials(m);
    setQuestions(q);
  }

  useEffect(() => {
    reload().catch((e) => setError(e instanceof Error ? e.message : 'Failed'));
  }, [courseId, topicId]);

  async function onMaterial(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      const created = await createMaterial(courseId, topicId, {
        title: String(fd.get('title') || ''),
        type: String(fd.get('type') || 'text_summary'),
        body: String(fd.get('body') || '') || undefined,
        externalUrl: String(fd.get('externalUrl') || '') || undefined,
      });
      const file = fd.get('file');
      if (file instanceof File && file.size > 0) {
        await uploadMaterialFile(courseId, created.id, file);
      }
      e.currentTarget.reset();
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Material failed');
    }
  }

  async function onQuestion(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const type = String(fd.get('type') || 'mcq');
    const payload: Record<string, unknown> = {
      type,
      prompt: String(fd.get('prompt') || ''),
      marks: String(fd.get('marks') || '1'),
      hints: String(fd.get('hints') || '')
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean),
    };
    if (type === 'mcq') {
      payload.options = [
        { id: 'a', label: String(fd.get('optA') || 'A') },
        { id: 'b', label: String(fd.get('optB') || 'B') },
      ];
      payload.mcqCorrectOptionId = String(fd.get('correct') || 'a');
    } else if (type === 'numerical') {
      payload.numericalValue = String(fd.get('numericalValue') || '');
      payload.numericalTolerance = String(fd.get('numericalTolerance') || '0.01');
    } else {
      payload.journalLines = [
        {
          account: String(fd.get('drAccount') || 'Cash'),
          direction: 'debit',
          amount: String(fd.get('amount') || '100.00'),
        },
        {
          account: String(fd.get('crAccount') || 'Capital'),
          direction: 'credit',
          amount: String(fd.get('amount') || '100.00'),
        },
      ];
      payload.alternateAccounts = { Cash: ['Bank'] };
      payload.misconceptionTags = ['debit_credit_swap'];
    }
    try {
      await createQuestion(courseId, topicId, payload);
      e.currentTarget.reset();
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Question failed');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl">
          {topic?.title || 'Topic'}
        </h1>
        <p className="text-[var(--ink-muted)]">Publish materials and questions without developer help.</p>
      </div>
      <ErrorNote>{error}</ErrorNote>

      <Panel title="Materials">
        <ul className="mb-4 space-y-2 text-sm">
          {materials.map((m) => (
            <li key={m.id} className="flex flex-wrap items-center gap-2">
              <span>
                {m.title} · {m.status}
              </span>
              {m.status !== 'published' ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    publishMaterial(courseId, m.id)
                      .then(reload)
                      .catch((e) =>
                        setError(e instanceof Error ? e.message : 'Publish failed'),
                      )
                  }
                >
                  Publish
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    withdrawMaterial(courseId, m.id)
                      .then(reload)
                      .catch((e) =>
                        setError(e instanceof Error ? e.message : 'Withdraw failed'),
                      )
                  }
                >
                  Withdraw
                </Button>
              )}
            </li>
          ))}
          {materials.length === 0 ? <Empty>No materials yet.</Empty> : null}
        </ul>
        <form onSubmit={onMaterial} className="grid gap-3 md:grid-cols-2">
          <Field id="title" name="title" label="Title" required />
          <Select id="type" name="type" label="Type" defaultValue="text_summary">
            <option value="text_summary">Text summary</option>
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
            <option value="slides">Slides</option>
            <option value="video_link">Video link</option>
          </Select>
          <TextArea id="body" name="body" label="Body (text summary)" />
          <Field id="externalUrl" name="externalUrl" label="External URL" />
          <Field id="file" name="file" type="file" label="Upload file" />
          <div className="flex items-end">
            <Button type="submit">Add material</Button>
          </div>
        </form>
      </Panel>

      <Panel title="Questions">
        <ul className="mb-4 space-y-2 text-sm">
          {questions.map((q) => (
            <li key={q.id} className="flex flex-wrap items-center gap-2">
              <span>
                [{q.type}] {q.prompt.slice(0, 80)} · {q.status}
              </span>
              {q.status !== 'published' ? (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    publishQuestion(courseId, q.id)
                      .then(reload)
                      .catch((e) =>
                        setError(e instanceof Error ? e.message : 'Publish failed'),
                      )
                  }
                >
                  Publish
                </Button>
              ) : null}
            </li>
          ))}
          {questions.length === 0 ? <Empty>No questions yet.</Empty> : null}
        </ul>
        <form onSubmit={onQuestion} className="grid gap-3 md:grid-cols-2">
          <Select id="type" name="type" label="Type" defaultValue="journal">
            <option value="mcq">MCQ</option>
            <option value="numerical">Numerical</option>
            <option value="journal">Journal</option>
          </Select>
          <Field id="marks" name="marks" label="Marks" defaultValue="2" />
          <div className="md:col-span-2">
            <TextArea id="prompt" name="prompt" label="Prompt" required />
          </div>
          <Field id="optA" name="optA" label="MCQ option A" defaultValue="Cash" />
          <Field id="optB" name="optB" label="MCQ option B" defaultValue="Capital" />
          <Field id="correct" name="correct" label="MCQ correct id" defaultValue="a" />
          <Field id="numericalValue" name="numericalValue" label="Numerical value" />
          <Field id="numericalTolerance" name="numericalTolerance" label="Tolerance" defaultValue="0.01" />
          <Field id="drAccount" name="drAccount" label="Journal debit account" defaultValue="Cash" />
          <Field id="crAccount" name="crAccount" label="Journal credit account" defaultValue="Capital" />
          <Field id="amount" name="amount" label="Journal amount" defaultValue="500.00" />
          <Field id="hints" name="hints" label="Hints (pipe-separated)" defaultValue="Think about which account increases with a debit" />
          <div className="flex items-end">
            <Button type="submit">Add question</Button>
          </div>
        </form>
      </Panel>

      <Panel title="CSV import">
        <TextArea
          id="csv"
          label="CSV"
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              previewQuestionCsv(courseId, topicId, csvText)
                .then(setCsvPreview)
                .catch((e) =>
                  setError(e instanceof Error ? e.message : 'Preview failed'),
                )
            }
          >
            Preview
          </Button>
          <Button
            type="button"
            onClick={() =>
              commitQuestionCsv(courseId, topicId, csvText)
                .then(() => reload())
                .catch((e) =>
                  setError(e instanceof Error ? e.message : 'Commit failed'),
                )
            }
          >
            Commit publish
          </Button>
        </div>
        {csvPreview ? (
          <pre className="mt-3 overflow-auto rounded-md bg-[var(--wash)] p-3 text-xs">
            {JSON.stringify(csvPreview, null, 2)}
          </pre>
        ) : null}
      </Panel>
    </div>
  );
}
