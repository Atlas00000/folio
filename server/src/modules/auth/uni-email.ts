/**
 * University-email enrolment (DEC-04 locked).
 * Domains come from UNI_EMAIL_DOMAINS (comma-separated).
 * A domain match is exact suffix: user@example.ac.uk matches "example.ac.uk" or "ac.uk".
 */
export function getAllowedUniEmailDomains(): string[] {
  const raw = process.env.UNI_EMAIL_DOMAINS ?? 'example.ac.uk,ac.uk';
  return raw
    .split(',')
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
}

export function isUniversityEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  const at = normalized.lastIndexOf('@');
  if (at < 1 || at === normalized.length - 1) {
    return false;
  }
  const domain = normalized.slice(at + 1);
  return getAllowedUniEmailDomains().some(
    (allowed) => domain === allowed || domain.endsWith(`.${allowed}`),
  );
}
