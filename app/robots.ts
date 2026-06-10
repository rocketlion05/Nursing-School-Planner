import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/profile',
          '/plan',
          '/deadlines',
          '/admin/',
          '/api/',
          '/verify-email',
          '/forgot-password',
          '/reset-password',
          '/request-school',
          '/payment/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
