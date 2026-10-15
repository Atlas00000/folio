import { Text } from '@/design/primitives';
import { PageEnter } from '@/design/motion';
import { materialDownloadUrl } from '@/lib/api/materials';
import type { Material } from '@/lib/types';

function labelForMaterialType(type: string) {
  if (!type) return 'Material';
  return type.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function TopicMaterialsLedgerItem({
  material,
  courseId,
  index = 0,
  dimmed = false,
}: {
  material: Material;
  courseId: string;
  index?: number;
  /** True when this row is the reading-focus surface above */
  dimmed?: boolean;
}) {
  const stage = Math.min(index, 3) as 0 | 1 | 2 | 3;
  const canDownload = ['pdf', 'docx', 'slides', 'text_summary'].includes(
    material.type,
  );

  return (
    <PageEnter stage={stage}>
      <div
        className={`grid gap-2 border-b border-[var(--folio-hairline)] py-4 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-6 ${
          dimmed ? 'opacity-70' : ''
        }`}
      >
        <div className="min-w-0 space-y-1">
          <Text as="p" face="display" size="lg" className="leading-tight">
            {material.title}
          </Text>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <Text as="span" face="label" tone="faint">
              {labelForMaterialType(material.type)}
            </Text>
            {material.version != null ? (
              <Text as="span" face="mono" size="xs" tone="faint">
                v{material.version}
              </Text>
            ) : null}
            {dimmed ? (
              <Text as="span" face="label" tone="muted">
                Shown above
              </Text>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {material.externalUrl ? (
            <a
              href={material.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] uppercase tracking-[var(--folio-tracking-label)] text-[var(--folio-signal)] hover:underline"
            >
              Open link
            </a>
          ) : null}
          {canDownload ? (
            <a
              href={materialDownloadUrl(courseId, material.id)}
              className="font-[family-name:var(--folio-font-mono)] text-[length:var(--folio-text-xs)] uppercase tracking-[var(--folio-tracking-label)] text-[var(--folio-ink-muted)] hover:text-[var(--folio-signal)]"
            >
              Download
            </a>
          ) : null}
        </div>
      </div>
    </PageEnter>
  );
}
