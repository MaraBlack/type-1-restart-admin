import { Performer } from '../models/performer.model';

const now = '2026-07-27T00:00:00.000Z';

export const MOCK_PERFORMERS: Performer[] = [
  {
    id: 'performer-001',
    name: 'The Blue Notes',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=240&h=240&fit=crop',
    websiteUrl: 'https://example.com/blue-notes',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'performer-002',
    name: 'Acoustic Horizons',
    imageUrl: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=240&h=240&fit=crop',
    websiteUrl: 'https://example.com/acoustic-horizons',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'performer-003',
    name: 'Urban Echo',
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=240&h=240&fit=crop',
    websiteUrl: 'https://example.com/urban-echo',
    createdAt: now,
    updatedAt: now
  }
];
