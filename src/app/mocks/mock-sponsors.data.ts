import { Sponsor } from '../models/sponsor.model';

const now = '2026-07-27T00:00:00.000Z';

export const MOCK_SPONSORS: Sponsor[] = [
  {
    id: 'sponsor-001',
    name: 'Hope Foundation',
    websiteUrl: 'https://example.org',
    type: 'sponsor',
    logoImageURL: 'https://images.seeklogo.com/logo-png/32/1/medlife-logo-png_seeklogo-320752.png',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'sponsor-002',
    name: 'Future Labs',
    websiteUrl: 'https://example.com',
    type: 'partner',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'sponsor-003',
    name: 'Community Voice',
    websiteUrl: 'https://example.net',
    type: 'mediaPartner',
    createdAt: now,
    updatedAt: now
  }
];