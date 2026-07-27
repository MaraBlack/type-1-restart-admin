import { ImageAsset } from './image.model';

export type SponsorType = 'sponsor' | 'partner' | 'mediaPartner' | 'organizer';

export interface Sponsor {
  id: string;
  name: string;
  logoImageURL?: string;
  logoImage?: ImageAsset;
  websiteUrl?: string;
  type: SponsorType;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSponsorRequest {
  name: string;
  logoImageURL?: string;
  websiteUrl?: string;
  type: SponsorType;
}

export interface UpdateSponsorRequest extends Partial<CreateSponsorRequest> {
  id: string;
}