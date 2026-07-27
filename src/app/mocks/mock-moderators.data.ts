import { Moderator } from '../models/moderator.model';

const now = '2026-07-27T00:00:00.000Z';

export const MOCK_MODERATORS: Moderator[] = [
  {
    id: 'moderator-001',
    name: 'Dr. Ana Ionescu',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&h=240&fit=crop',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'moderator-002',
    name: 'Mihai Popescu',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&h=240&fit=crop',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'moderator-003',
    name: 'Ioana Dobre',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240&h=240&fit=crop',
    createdAt: now,
    updatedAt: now
  }
];
