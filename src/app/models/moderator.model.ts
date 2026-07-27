export interface Moderator {
  id: string;
  name: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateModeratorRequest {
  name: string;
  imageUrl?: string;
}

export interface UpdateModeratorRequest extends Partial<CreateModeratorRequest> {
  id: string;
}
