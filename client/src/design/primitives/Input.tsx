import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

const fieldClass =
  'w-full rounded-[var(--folio-radius-sm)] border border-[var(--folio-hairline-strong)] bg-[var(--folio-void)] px-3 py-2 text-[length:var(--folio-text-sm)] text-[var(--folio-ink)] outline-none transition-[border-color,box-shadow] duration-[var(--folio-dur-fast)] placeholder:text-[var(--folio-ink-faint)] focus:border-[var(--folio-signal)] focus:shadow-[0_0_0_3px_var(--folio-signal-dim)]';

function FieldLabel({
  id,
  label,
  children,
}: {
  id?: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5 text-[length:var(--folio-text-sm)]" htmlFor={id}>
      <span className="font-medium uppercase tracking-[var(--folio-tracking-label)] text-[length:var(--folio-text-xs)] text-[var(--folio-ink-faint)]">
        {label}
      </span>
      {children}
    </label>
  );
}

export function Field({
  label,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <FieldLabel id={id} label={label}>
      <input id={id} className={fieldClass} {...props} />
    </FieldLabel>
  );
}

export function TextArea({
  label,
  id,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <FieldLabel id={id} label={label}>
      <textarea id={id} className={`min-h-28 ${fieldClass}`} {...props} />
    </FieldLabel>
  );
}

export function Select({
  label,
  id,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  children: ReactNode;
}) {
  return (
    <FieldLabel id={id} label={label}>
      <select id={id} className={fieldClass} {...props}>
        {children}
      </select>
    </FieldLabel>
  );
}
