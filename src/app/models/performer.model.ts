export interface Performer {
  id: string;
  name: string;
  imageUrl?: string;
  websiteUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePerformerRequest {
  name: string;
  imageUrl?: string;
  websiteUrl?: string;
}

export interface UpdatePerformerRequest extends Partial<CreatePerformerRequest> {
  id: string;
}
