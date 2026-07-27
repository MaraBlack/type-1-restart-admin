import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { CreateImageRequest, ImageAsset } from '../models/image.model';
import { MOCK_IMAGES } from '../mocks/mock-images.data';

@Injectable({ providedIn: 'root' })
export class ImagesService {
  private images = [...MOCK_IMAGES];

  getImages(): Observable<ImageAsset[]> {
    return of(this.images.map((image) => ({ ...image, alt: { ...image.alt } })));
  }

  getImageById(id: string): Observable<ImageAsset | undefined> {
    const image = this.images.find((item) => item.id === id);

    return of(image ? { ...image, alt: { ...image.alt } } : undefined);
  }

  createImage(payload: CreateImageRequest): Observable<ImageAsset> {
    const now = new Date().toISOString();
    const image: ImageAsset = {
      id: this.generateId('img'),
      url: payload.url,
      alt: payload.alt ?? { ro: '', en: '' },
      type: payload.type,
      provider: payload.provider,
      storageKey: payload.storageKey,
      width: payload.width,
      height: payload.height,
      createdAt: now,
      updatedAt: now
    };

    this.images = [...this.images, image];

    return of({ ...image, alt: { ...image.alt } });
  }

  private generateId(prefix: string): string {
    return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
  }
}