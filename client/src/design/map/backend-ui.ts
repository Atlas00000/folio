import type { Tone } from '@/design/tokens';

/** Course.status */
export type CourseLifecycle = 'draft' | 'active' | 'archived' | string;

/** materials/questions publication_status */
export type PublicationLifecycle =
  | 'unpublished'
  | 'published'
  | 'withdrawn'
  | string;

/** questions.difficulty — practice "zone" */
export type DifficultyZone = 'intro' | 'core' | 'stretch' | string;

export type UserLifecycle = 'active' | 'pending' | 'disabled' | string;
export type EnrolmentLifecycle = 'active' | 'withdrawn' | string;

export type AttemptGates = {
  canRequestHint?: boolean;
  canRetry?: boolean;
  canReveal?: boolean;
};

export function toneForCourseLifecycle(status: CourseLifecycle): Tone {
  switch (status) {
    case 'active':
      return 'signal';
    case 'draft':
      return 'faint';
    case 'archived':
      return 'muted';
    default:
      return 'muted';
  }
}

export function labelForCourseLifecycle(status: CourseLifecycle): string {
  switch (status) {
    case 'active':
      return 'Active';
    case 'draft':
      return 'Draft';
    case 'archived':
      return 'Archived';
    default:
      return status;
  }
}

export function toneForPublication(status: PublicationLifecycle): Tone {
  switch (status) {
    case 'published':
      return 'ok';
    case 'unpublished':
      return 'warn';
    case 'withdrawn':
      return 'faint';
    default:
      return 'muted';
  }
}

export function labelForPublication(status: PublicationLifecycle): string {
  switch (status) {
    case 'published':
      return 'Published';
    case 'unpublished':
      return 'Unpublished';
    case 'withdrawn':
      return 'Withdrawn';
    default:
      return status;
  }
}

export function toneForZone(zone: DifficultyZone): Tone {
  switch (zone) {
    case 'intro':
      return 'muted';
    case 'core':
      return 'ink';
    case 'stretch':
      return 'signal';
    default:
      return 'muted';
  }
}

export function labelForZone(zone: DifficultyZone): string {
  switch (zone) {
    case 'intro':
      return 'Intro';
    case 'core':
      return 'Core';
    case 'stretch':
      return 'Stretch';
    default:
      return zone;
  }
}

export function toneForMark(correct: boolean): Tone {
  return correct ? 'ok' : 'halt';
}

export function toneForUserStatus(status: UserLifecycle): Tone {
  switch (status) {
    case 'active':
      return 'ok';
    case 'pending':
      return 'warn';
    case 'disabled':
      return 'faint';
    default:
      return 'muted';
  }
}

export function toneForEnrolment(status: EnrolmentLifecycle): Tone {
  return status === 'active' ? 'ok' : 'faint';
}

/** Gate decision → allow (signal) vs skip/unavailable (faint) */
export function toneForGate(allowed: boolean): Tone {
  return allowed ? 'signal' : 'faint';
}

export function gateLabels(gates: AttemptGates): {
  key: keyof AttemptGates;
  label: string;
  allowed: boolean;
  tone: Tone;
}[] {
  return (
    [
      {
        key: 'canRetry' as const,
        label: 'Retry',
        allowed: Boolean(gates.canRetry),
      },
      {
        key: 'canRequestHint' as const,
        label: 'Hint',
        allowed: Boolean(gates.canRequestHint),
      },
      {
        key: 'canReveal' as const,
        label: 'Reveal',
        allowed: Boolean(gates.canReveal),
      },
    ] as const
  ).map((g) => ({
    ...g,
    tone: toneForGate(g.allowed),
  }));
}
