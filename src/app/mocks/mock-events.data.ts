import { Event } from '../models/event.model';

const now = '2026-07-27T00:00:00.000Z';

export const MOCK_EVENTS: Event[] = [
  {
    id: 'event-001',
    title: {
      ro: 'Future Impact Conference 2026',
      en: 'Future Impact Conference 2026'
    },
    shortDescription: {
      ro: 'Conferință despre leadership, educație și comunități sustenabile.',
      en: 'Conference about leadership, education, and sustainable communities.'
    },
    description: {
      ro: 'O zi de paneluri, networking și studii de caz pentru echipe care construiesc programe cu impact.',
      en: 'A full day of panels, networking, and case studies for teams building impact-driven programs.'
    },
    category: 'conference',
    status: 'draft',
    schedule: {
      startDate: '2026-09-14',
      endDate: '2026-09-14',
      startTime: '09:30',
      endTime: '17:30',
      timezone: 'Europe/Bucharest'
    },
    location: {
      name: 'Grand Hall',
      type: 'offline',
      address: 'Strada Academiei 12',
      city: 'Bucharest',
      country: 'Romania',
      googleMapsUrl: 'https://maps.google.com'
    },
    coverImageId: 'img-001',
    coverImageUrl: 'https://placehold.co/1120x320?text=Future+Impact+Conference',
    socialLinks: {
      instagramUrl: 'https://instagram.com/futureimpactconf',
      facebookUrl: 'https://facebook.com/futureimpactconf',
      linkedinUrl: 'https://linkedin.com/company/future-impact'
    },
    sponsorIds: ['sponsor-001', 'sponsor-002'],
    moderatorIds: ['moderator-001', 'moderator-002'],
    performerIds: ['performer-001'],
    isFeatured: true,
    registrationUrl: 'https://example.org/register',
    publishedAt: '2026-07-15T08:00:00.000Z',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'event-002',
    title: {
      ro: 'Community Workshop Series',
      en: 'Community Workshop Series'
    },
    shortDescription: {
      ro: 'Serie de ateliere cu echipe locale și voluntari.',
      en: 'Workshop series with local teams and volunteers.'
    },
    description: {
      ro: 'Ateliere practice pentru facilitare, planificare și colaborare în proiecte mici și medii.',
      en: 'Practical sessions for facilitation, planning, and collaboration in small and mid-sized projects.'
    },
    category: 'workshop',
    status: 'draft',
    schedule: {
      startDate: '2026-10-03',
      startTime: '10:00',
      endTime: '16:00',
      timezone: 'Europe/Bucharest'
    },
    location: {
      name: 'Hub 11',
      type: 'offline',
      ticketingUrl: 'https://example.com/workshop-live',
      address: 'Bulevardul Carol I 11',
      city: 'Cluj-Napoca',
      country: 'Romania'
    },
    coverImageId: 'img-002',
    coverImageUrl: 'https://placehold.co/1120x320?text=Community+Workshop',
    socialLinks: {
      instagramUrl: 'https://instagram.com/communityworkshops',
      xUrl: 'https://x.com/communityworkshop'
    },
    sponsorIds: ['sponsor-003'],
    moderatorIds: ['moderator-003'],
    performerIds: ['performer-002'],
    registrationUrl: 'https://example.com/workshop',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'event-003',
    title: {
      ro: 'Digital Volunteering Webinar',
      en: 'Digital Volunteering Webinar'
    },
    shortDescription: {
      ro: 'Webinar scurt despre procesul de înscriere și roluri digitale.',
      en: 'Short webinar about onboarding and digital volunteer roles.'
    },
    description: {
      ro: 'O sesiune online pentru echipe care vor să crească rapid comunități digitale.',
      en: 'An online session for teams that want to grow digital communities fast.'
    },
    category: 'webinar',
    status: 'published',
    schedule: {
      startDate: '2026-05-21',
      startTime: '18:00',
      endTime: '20:00',
      timezone: 'Europe/Bucharest'
    },
    location: {
      name: 'Online',
      type: 'online',
      ticketingUrl: 'https://example.net/webinar-access',
      address: 'Zoom',
      country: 'Romania'
    },
    socialLinks: {
      youtubeUrl: 'https://youtube.com/@digital-volunteering',
      facebookUrl: 'https://facebook.com/digitalvolunteering'
    },
    sponsorIds: [],
    moderatorIds: [],
    performerIds: [],
    coverImageUrl: 'https://placehold.co/1120x320?text=Digital+Volunteering+Webinar',
    publishedAt: '2026-05-01T10:00:00.000Z',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'event-004',
    title: {
      ro: 'Local Community Cleanup Day',
      en: 'Local Community Cleanup Day'
    },
    shortDescription: {
      ro: 'Eveniment local de voluntariat pentru ecologizare.',
      en: 'Local volunteering event focused on cleanup and recycling.'
    },
    description: {
      ro: 'Participanții se întâlnesc în cartier pentru colectare selectivă și activități educative pentru copii.',
      en: 'Participants gather in the neighborhood for selective waste collection and educational activities for kids.'
    },
    category: 'community',
    status: 'published',
    schedule: {
      startDate: '2026-08-30',
      startTime: '08:30',
      endTime: '13:00',
      timezone: 'Europe/Bucharest'
    },
    location: {
      name: 'Parcul Central',
      type: 'offline',
      address: 'Aleea Centrala 2',
      city: 'Iasi',
      county: 'Iasi',
      country: 'Romania',
      googleMapsUrl: 'https://maps.google.com/?q=Parcul+Central+Iasi'
    },
    sponsorIds: ['sponsor-001'],
    moderatorIds: [],
    performerIds: [],
    coverImageUrl: 'https://placehold.co/1120x320?text=Cleanup+Day',
    isFeatured: false,
    publishedAt: '2026-07-20T09:00:00.000Z',
    createdAt: now,
    updatedAt: now
  },
  {
    id: 'event-005',
    title: {
      ro: 'Pilot Fundraising Draft',
      en: 'Pilot Fundraising Draft'
    },
    shortDescription: {
      ro: 'Draft intern pentru un nou format de campanie.',
      en: 'Internal draft for a new campaign format.'
    },
    description: {
      ro: 'Acest eveniment este intenționat minim pentru testarea câmpurilor opționale în formular.',
      en: 'This event is intentionally minimal to test optional form fields.'
    },
    category: 'fundraising',
    status: 'draft',
    schedule: {
      startDate: '2026-11-12',
      startTime: '09:00',
      endTime: '12:00'
    },
    location: {
      name: 'TBD',
      type: 'online'
    },
    sponsorIds: [],
    moderatorIds: [],
    performerIds: [],
    coverImageUrl: 'https://placehold.co/1120x320?text=Pilot+Fundraising',
    createdAt: now,
    updatedAt: now
  }
];