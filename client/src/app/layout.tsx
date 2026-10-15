import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans, Instrument_Serif } from 'next/font/google';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { ThemeProvider } from '@/design/ThemeProvider';
import './globals.css';

const display = Instrument_Serif({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400'],
});

const body = IBM_Plex_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const mono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'Folio',
  description: 'First-year accounting practice — materials, questions, progress.',
  applicationName: 'Folio',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'Folio' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#efefeb' },
    { media: '(prefers-color-scheme: dark)', color: '#0e0f10' },
    { color: '#0e0f10' },
  ],
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'dark light',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
