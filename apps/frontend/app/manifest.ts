import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Bachata Flow',
    short_name: 'BachataFlow',
    description: 'dance moves',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}