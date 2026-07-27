import { ImageAsset } from '../models/image.model';

const now = '2026-07-27T00:00:00.000Z';

export const MOCK_IMAGES: ImageAsset[] = [
  {
    id: 'img-001',
    url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    alt: {
      ro: 'Public la eveniment',
      en: 'Audience at event'
    },
    type: 'eventCover',
    provider: 'unsplash',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'img-002',
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    alt: {
      ro: 'Workshop colaborativ',
      en: 'Collaborative workshop'
    },
    type: 'eventCover',
    provider: 'unsplash',
    createdAt: now,
    updatedAt: now
  }
];