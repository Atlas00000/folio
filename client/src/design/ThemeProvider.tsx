'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

/** Resolved paint mode on `<html data-theme>`. */
export type FolioTheme = 'dark' | 'light';

/** User preference — `system` follows `prefers-color-scheme`. */
export type FolioThemePreference = FolioTheme | 'system';

const STORAGE_KEY = 'folio-theme';

type ThemeContextValue = {
  /** Active paint theme after resolving system. */
  theme: FolioTheme;
  /** Stored preference (may be system). */
  preference: FolioThemePreference;
  setTheme: (t: FolioThemePreference) => void;
  /** Cycles dark ↔ light (ignores system). Kept for callers. */
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function isPreference(value: string | null): value is FolioThemePreference {
  return value === 'dark' || value === 'light' || value === 'system';
}

function systemTheme(): FolioTheme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function resolveTheme(preference: FolioThemePreference): FolioTheme {
  return preference === 'system' ? systemTheme() : preference;
}

function applyTheme(theme: FolioTheme) {
  document.documentElement.setAttribute('data-theme', theme);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] =
    useState<FolioThemePreference>('dark');
  const [theme, setThemeState] = useState<FolioTheme>('dark');

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const nextPref: FolioThemePreference = isPreference(stored)
      ? stored
      : 'dark';
    const nextTheme = resolveTheme(nextPref);
    setPreferenceState(nextPref);
    setThemeState(nextTheme);
    applyTheme(nextTheme);
  }, []);

  useEffect(() => {
    if (preference !== 'system') return;

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const next = resolveTheme('system');
      setThemeState(next);
      applyTheme(next);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [preference]);

  const setTheme = useCallback((t: FolioThemePreference) => {
    setPreferenceState(t);
    const resolved = resolveTheme(t);
    setThemeState(resolved);
    applyTheme(resolved);
    window.localStorage.setItem(STORAGE_KEY, t);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [setTheme, theme]);

  const value = useMemo(
    () => ({ theme, preference, setTheme, toggleTheme }),
    [theme, preference, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}

export { ThemeMenu, ThemeMenu as ThemeToggle } from './ThemeMenu';
