Fișier 1: admin-events-db.instructions.md

# Copilot Instructions — Admin Events DB & API Preparation

## Context

Prepare the admin events feature data layer for future integration with:

- Cloudflare D1
- Cloudflare Functions
- possible Cloudflare R2/image storage

For now, use mock objects, but structure services and models so the UI can later switch to real API calls without component refactors.

---

## Main Data Model

Use these future database tables:

```txt
events
images
sponsors
event_sponsors
```

Do not duplicate sponsors inside events. Sponsors are reusable entities.

Because one event can have multiple sponsors and one sponsor can appear in multiple events, use a many-to-many relation through `event_sponsors`.

---

## Table: `events`

```sql
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,

  title_ro TEXT NOT NULL,
  title_en TEXT,

  short_description_ro TEXT NOT NULL,
  short_description_en TEXT,

  description_ro TEXT NOT NULL,
  description_en TEXT,

  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',

  start_date TEXT NOT NULL,
  end_date TEXT,
  start_time TEXT,
  end_time TEXT,
  timezone TEXT,

  location_name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  county TEXT,
  country TEXT NOT NULL,
  google_maps_url TEXT,

  cover_image_id TEXT,

  is_featured INTEGER DEFAULT 0,
  registration_url TEXT,

  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,

  FOREIGN KEY (cover_image_id) REFERENCES images(id)
);
```

---

## Table: `images`

Used for:

- event cover images
- sponsor logos
- partner logos
- future reusable/general images

```sql
CREATE TABLE images (
  id TEXT PRIMARY KEY,

  url TEXT NOT NULL,
  alt_ro TEXT,
  alt_en TEXT,

  type TEXT NOT NULL,
  provider TEXT,
  storage_key TEXT,

  width INTEGER,
  height INTEGER,

  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

Image types:

```ts
export type ImageType = 'eventCover' | 'sponsorLogo' | 'partnerLogo' | 'general';
```

---

## Table: `sponsors`

Sponsors are reusable entities.

```sql
CREATE TABLE sponsors (
  id TEXT PRIMARY KEY,

  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,

  logo_image_id TEXT,
  website_url TEXT,

  type TEXT NOT NULL DEFAULT 'sponsor',

  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,

  FOREIGN KEY (logo_image_id) REFERENCES images(id)
);
```

Sponsor types:

```ts
export type SponsorType = 'sponsor' | 'partner' | 'mediaPartner' | 'organizer';
```

---

## Table: `event_sponsors`

Links events to sponsors.

```sql
CREATE TABLE event_sponsors (
  event_id TEXT NOT NULL,
  sponsor_id TEXT NOT NULL,

  sort_order INTEGER DEFAULT 0,

  PRIMARY KEY (event_id, sponsor_id),

  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (sponsor_id) REFERENCES sponsors(id)
);
```

---

# Angular Models

Create:

```txt
src/app/features/admin/events/models/
  image.model.ts
  sponsor.model.ts
  event.model.ts
```

---

## `image.model.ts`

```ts
export type ImageType = 'eventCover' | 'sponsorLogo' | 'partnerLogo' | 'general';

export interface ImageAsset {
  id: string;
  url: string;
  alt: {
    ro: string;
    en: string;
  };
  type: ImageType;
  provider?: string;
  storageKey?: string;
  width?: number;
  height?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateImageRequest {
  url: string;
  alt?: {
    ro: string;
    en: string;
  };
  type: ImageType;
  provider?: string;
  storageKey?: string;
  width?: number;
  height?: number;
}
```

---

## `sponsor.model.ts`

```ts
import { ImageAsset } from './image.model';

export type SponsorType = 'sponsor' | 'partner' | 'mediaPartner' | 'organizer';

export interface Sponsor {
  id: string;
  name: string;
  slug: string;
  logoImageId?: string;
  logoImage?: ImageAsset;
  websiteUrl?: string;
  type: SponsorType;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSponsorRequest {
  name: string;
  logoImageId?: string;
  websiteUrl?: string;
  type: SponsorType;
}

export interface UpdateSponsorRequest extends Partial<CreateSponsorRequest> {
  id: string;
}
```

---

## `event.model.ts`

```ts
import { ImageAsset } from './image.model';
import { Sponsor } from './sponsor.model';

export type EventStatus = 'draft' | 'published' | 'archived';

export type EventCategory =
  | 'conference'
  | 'workshop'
  | 'webinar'
  | 'campaign'
  | 'community'
  | 'fundraising'
  | 'other';

export interface LocalizedText {
  ro: string;
  en: string;
}

export interface EventSocialLinks {
  instagramUrl?: string;
  facebookUrl?: string;
  xUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
}

export interface EventLocation {
  name: string;
  address: string;
  city: string;
  county?: string;
  country: string;
  googleMapsUrl?: string;
}

export interface EventSchedule {
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  timezone?: string;
}

export interface Event {
  id: string;

  slug: string;
  title: LocalizedText;
  shortDescription: LocalizedText;
  description: LocalizedText;

  category: EventCategory;
  status: EventStatus;

  schedule: EventSchedule;
  location: EventLocation;

  coverImageId?: string;
  coverImage?: ImageAsset;

  socialLinks?: EventSocialLinks;

  sponsorIds: string[];
  sponsors?: Sponsor[];

  isFeatured?: boolean;
  registrationUrl?: string;

  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventListItem {
  id: string;
  slug: string;
  title: LocalizedText;
  category: EventCategory;
  status: EventStatus;
  startDate: string;
  startTime?: string;
  city: string;
  coverImageUrl?: string;
  sponsorCount?: number;
  publishedAt?: string;
  updatedAt: string;
}

export interface EventStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  upcoming: number;
}

export interface CreateEventRequest {
  slug: string;
  title: LocalizedText;
  shortDescription: LocalizedText;
  description: LocalizedText;
  category: EventCategory;
  status: EventStatus;

  schedule: EventSchedule;
  location: EventLocation;

  coverImageId?: string;
  socialLinks?: EventSocialLinks;

  sponsorIds: string[];

  isFeatured?: boolean;
  registrationUrl?: string;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  id: string;
}
```

---

# Services

Create:

```txt
src/app/features/admin/events/services/
  events.service.ts
  sponsors.service.ts
  images.service.ts
  mock-events.data.ts
  mock-sponsors.data.ts
  mock-images.data.ts
```

For now, services may use `of(...)` and local mock arrays.

Components must not know if data comes from mocks or API.

---

## `EventsService`

Required methods:

```ts
getEvents(): Observable<EventListItem[]>;

getEventById(id: string): Observable<Event>;

getStats(): Observable<EventStats>;

createEvent(payload: CreateEventRequest): Observable<Event>;

updateEvent(payload: UpdateEventRequest): Observable<Event>;

publishEvent(id: string): Observable<Event>;

unpublishEvent(id: string): Observable<Event>;

deleteEvent(id: string): Observable<void>;
```

Behavior:

- `getEvents()` returns list items.
- `getEventById()` returns full event details.
- `getStats()` computes totals from events.
- `createEvent()` creates an event with status `draft` or selected status.
- `updateEvent()` updates an existing event.
- `publishEvent()` changes status to `published` and sets `publishedAt`.
- `unpublishEvent()` changes status to `draft`.
- `deleteEvent()` removes the event from mock data.

Do not call HTTP directly from components.

---

## `SponsorsService`

Required methods:

```ts
getSponsors(forceRefresh?: boolean): Observable<Sponsor[]>;

searchSponsors(query: string): Observable<Sponsor[]>;

getSponsorById(id: string): Observable<Sponsor | undefined>;

createSponsor(payload: CreateSponsorRequest): Observable<Sponsor>;

updateSponsor(payload: UpdateSponsorRequest): Observable<Sponsor>;

deleteSponsor(id: string): Observable<void>;
```

Use internal cache.

Expected behavior:

- First `getSponsors()` loads mock/API list.
- Store sponsors in cache.
- Next calls return cache.
- `forceRefresh: true` reloads data.
- `createSponsor()` updates cache.
- `updateSponsor()` updates cache.
- `deleteSponsor()` removes from cache.

Example:

```ts
private sponsorsCache: Sponsor[] | null = null;

getSponsors(forceRefresh = false): Observable<Sponsor[]> {
  if (this.sponsorsCache && !forceRefresh) {
    return of(this.sponsorsCache);
  }

  return of(MOCK_SPONSORS).pipe(
    tap((sponsors) => {
      this.sponsorsCache = sponsors;
    })
  );
}
```

Do not introduce NgRx, Akita, Elf or another state library.

---

## `ImagesService`

Required methods:

```ts
getImages(): Observable<ImageAsset[]>;

getImageById(id: string): Observable<ImageAsset | undefined>;

createImage(payload: CreateImageRequest): Observable<ImageAsset>;

uploadImage(file: File, type: ImageType): Observable<ImageAsset>;

deleteImage(id: string): Observable<void>;
```

For now:

- `uploadImage()` may return a mock `ImageAsset`.
- Keep the method ready for future Cloudflare R2 integration.
- Event cover images use `coverImageId`.
- Sponsor logos use `logoImageId`.

---

# Mock Data

Create mock files:

```txt
mock-images.data.ts
mock-sponsors.data.ts
mock-events.data.ts
```

Example image mock:

```ts
import { ImageAsset } from '../models/image.model';

export const MOCK_IMAGES: ImageAsset[] = [
  {
    id: 'img-medlife-logo',
    url: '/assets/mock/sponsors/medlife.svg',
    alt: {
      ro: 'Logo MedLife',
      en: 'MedLife logo',
    },
    type: 'sponsorLogo',
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-01-01T10:00:00.000Z',
  },
];
```

Example sponsor mock:

```ts
import { Sponsor } from '../models/sponsor.model';
import { MOCK_IMAGES } from './mock-images.data';

export const MOCK_SPONSORS: Sponsor[] = [
  {
    id: 'sponsor-medlife',
    name: 'MedLife',
    slug: 'medlife',
    logoImageId: 'img-medlife-logo',
    logoImage: MOCK_IMAGES[0],
    websiteUrl: 'https://www.medlife.ro',
    type: 'sponsor',
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-01-01T10:00:00.000Z',
  },
];
```

---

# Future Cloudflare Functions API

Prepare Angular services for these future endpoints:

```txt
GET    /api/admin/events
GET    /api/admin/events/:id
POST   /api/admin/events
PATCH  /api/admin/events/:id
DELETE /api/admin/events/:id

POST   /api/admin/events/:id/publish
POST   /api/admin/events/:id/unpublish

GET    /api/admin/sponsors
POST   /api/admin/sponsors
PATCH  /api/admin/sponsors/:id
DELETE /api/admin/sponsors/:id

GET    /api/admin/images
POST   /api/admin/images
POST   /api/admin/images/upload
DELETE /api/admin/images/:id
```

Do not hardcode the API base URL.

Use environment config.

If missing, add or adapt:

```ts
export const env = {
  apiBaseUrl: '/api',
};
```

in:

```txt
src/env/env.ts
src/env/env.prod.ts
```

---

# API Contracts

## Events List Response

```ts
{
  events: EventListItem[];
}
```

## Event Details Response

```ts
{
  event: Event;
}
```

The returned event may include resolved relations:

```ts
coverImage?: ImageAsset;
sponsors?: Sponsor[];
```

## Sponsors Response

```ts
{
  sponsors: Sponsor[];
}
```

## Images Response

```ts
{
  images: ImageAsset[];
}
```

---

# Important Rules

- Event create/update payloads must store only `sponsorIds`.
- Do not duplicate full sponsor objects inside event payloads.
- Event list may include only `sponsorCount`.
- Event details may include resolved `sponsors`.
- Sponsors are loaded once and cached in `SponsorsService`.
- Newly created sponsors must be added to cache.
- Newly uploaded/created images must return an `ImageAsset`.
- Components must depend only on services, not mocks.
- No direct `HttpClient` calls inside components.
- No hardcoded API URLs.
- No state management library.

---

# Validation

After implementation, run:

```bash
npm run build
```
