import { Text } from '@/design/primitives';

export function SpecialBrand({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="h-6 w-[3px] bg-[var(--folio-signal)]"
        />
        <Text as="p" face="label" tone="faint">
          {eyebrow}
        </Text>
      </div>
      <Text
        as="h1"
        face="display"
        className="text-4xl leading-none tracking-[var(--folio-tracking-tight)] sm:text-6xl md:text-7xl"
      >
        {title}
      </Text>
      {subtitle ? (
        <Text as="p" size="md" tone="muted" className="max-w-md">
          {subtitle}
        </Text>
      ) : null}
    </div>
  );
}
