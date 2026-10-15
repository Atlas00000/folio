import { Badge, Text } from '@/design/primitives';
import { PageEnter } from '@/design/motion';
import type { TutorReply } from './types';

function stateTone(state: string, insufficient?: boolean) {
  if (insufficient || state === 'insufficient_evidence') return 'warn' as const;
  if (state === 'hint') return 'signal' as const;
  return 'muted' as const;
}

function stateLabel(state: string, insufficient?: boolean) {
  if (insufficient || state === 'insufficient_evidence') {
    return 'Insufficient evidence';
  }
  if (state === 'hint') return 'Hint';
  return state;
}

export function TutorReplyInstrument({ reply }: { reply: TutorReply | null }) {
  if (!reply) return null;

  const tone = stateTone(reply.state, reply.insufficientEvidence);

  return (
    <PageEnter stage={2} className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--folio-hairline)] pb-2">
        <div>
          <Text as="h2" face="display" size="xl">
            Reply
          </Text>
          <Text as="p" size="sm" tone="muted" className="mt-1">
            Grounded instrument — not a mark or worked solution dump.
          </Text>
        </div>
        <Badge tone={tone}>
          {stateLabel(reply.state, reply.insufficientEvidence)}
        </Badge>
      </div>

      <div
        className="relative overflow-hidden border-y border-[var(--folio-hairline-strong)] py-6"
        style={{
          backgroundImage:
            'linear-gradient(var(--folio-hairline) 1px, transparent 1px)',
          backgroundSize: '100% 1.75rem',
        }}
      >
        <Text
          as="p"
          size="md"
          className="relative max-w-3xl whitespace-pre-wrap leading-[1.75]"
        >
          {reply.reply}
        </Text>
      </div>

      <Text as="p" face="mono" size="xs" tone="faint">
        This is a study hint. It does not replace marking or lecturer feedback.
      </Text>
    </PageEnter>
  );
}
