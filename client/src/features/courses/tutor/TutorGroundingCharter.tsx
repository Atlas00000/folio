import { Text } from '@/design/primitives';
import { PageEnter } from '@/design/motion';

const RULES = [
  'Hints come only from published course materials for this enrolment.',
  'The assistant will not invent journal lines, numerical marks, or answer keys.',
  'If retrieval is thin, it refuses with insufficient evidence — ask your lecturer or open a closer reading.',
];

export function TutorGroundingCharter() {
  return (
    <PageEnter stage={1} className="space-y-3">
      <Text as="h2" face="display" size="lg">
        Grounding charter
      </Text>
      <ul className="list-none space-y-2 border-y border-[var(--folio-hairline)] py-4 p-0">
        {RULES.map((rule) => (
          <li
            key={rule}
            className="grid grid-cols-[0.75rem_1fr] gap-3 items-start"
          >
            <span
              aria-hidden
              className="mt-2 h-1.5 w-1.5 rounded-full bg-[var(--folio-signal)]"
            />
            <Text as="p" size="sm" tone="muted">
              {rule}
            </Text>
          </li>
        ))}
      </ul>
    </PageEnter>
  );
}
