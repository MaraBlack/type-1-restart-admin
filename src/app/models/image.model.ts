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