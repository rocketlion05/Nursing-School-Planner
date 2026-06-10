import type { MetadataRoute } from 'next'
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/seo'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: 'NS Planner',
    description: SITE_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#f9fafb',
    theme_color: '#0d9488',
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
