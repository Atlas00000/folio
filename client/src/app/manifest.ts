import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Folio',
    short_name: 'Folio',
    description: 'First-year accounting learning PWA',
    start_url: '/',
    display: 'standalone',
    background_color: '#f3f1eb',
    theme_color: '#1f6b4a',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
