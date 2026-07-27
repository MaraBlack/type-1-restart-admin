import { ImageAsset } from './image.model';
import { Sponsor } from './sponsor.model';

export type EventStatus = 'draft' | 'published';

export type EventLocationType = 'online' | 'offline';

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

export interface EventPartner {
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
}

export interface EventLocation {
  name: string;
  type?: EventLocationType;
  ticketingUrl?: string;
  address?: string;
  city?: string;
  county?: string;
  country?: string;
  googleMapsUrl?: string;
}

export interface EventSchedule {
  startDate: string;
  endDate?: string;
  startTime: string;
  endTime: string;
  timezone?: string;
}

export interface Event {
  id: string;
  title: LocalizedText;
  shortDescription: LocalizedText;
  description: LocalizedText;
  category: EventCategory;
  status: EventStatus;
  schedule: EventSchedule;
  location: EventLocation;
  coverImageId?: string;
  coverImageUrl: string;
  coverImage?: ImageAsset;
  socialLinks?: EventSocialLinks;
  sponsorIds: string[];
  partners?: EventPartner[];
  moderatorIds: string[];
  performerIds: string[];
  sponsors?: Sponsor[];
  isFeatured?: boolean;
  registrationUrl?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventListItem {
  id: string;
  title: LocalizedText;
  category: EventCategory;
  status: EventStatus;
  startDate: string;
  startTime?: string;
  type: EventLocationType;
  city?: string;
  coverImageUrl?: string;
  sponsorCount?: number;
  publishedAt?: string;
  updatedAt: string;
  isFeatured?: boolean;
}

export interface EventStats {
  total?: number;
  published?: number;
  draft?: number;
}

export interface CreateEventRequest {
  title: LocalizedText;
  shortDescription: LocalizedText;
  description: LocalizedText;
  category: EventCategory;
  status: EventStatus;
  schedule: EventSchedule;
  location: EventLocation;
  coverImageId?: string;
  coverImageUrl: string;
  socialLinks?: EventSocialLinks;
  sponsorIds: string[];
  partners?: EventPartner[];
  moderatorIds: string[];
  performerIds?: string[];
  isFeatured?: boolean;
  registrationUrl?: string;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  id: string;
}