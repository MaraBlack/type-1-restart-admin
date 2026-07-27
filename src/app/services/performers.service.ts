import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';

import {
  CreatePerformerRequest,
  Performer,
  UpdatePerformerRequest
} from '../models/performer.model';
import { MOCK_PERFORMERS } from '../mocks/mock-performers.data';

@Injectable({ providedIn: 'root' })
export class PerformersService {
  private readonly performersSubject = new BehaviorSubject<Performer[]>(MOCK_PERFORMERS);

  getPerformers(): Observable<Performer[]> {
    return this.performersSubject.asObservable();
  }

  getSnapshot(): Performer[] {
    return this.performersSubject.value;
  }

  createPerformer(payload: CreatePerformerRequest): Observable<Performer> {
    const now = new Date().toISOString();
    const performer: Performer = {
      id: this.generateId(),
      name: payload.name.trim(),
      imageUrl: payload.imageUrl?.trim() || undefined,
      websiteUrl: payload.websiteUrl?.trim() || undefined,
      createdAt: now,
      updatedAt: now
    };

    this.performersSubject.next([...this.performersSubject.value, performer]);

    return of(performer);
  }

  updatePerformer(payload: UpdatePerformerRequest): Observable<Performer> {
    const current = this.performersSubject.value;
    const existing = current.find((performer) => performer.id === payload.id);

    if (!existing) {
      return throwError(() => new Error(`Performer not found: ${payload.id}`));
    }

    const updated: Performer = {
      ...existing,
      ...payload,
      name: payload.name?.trim() ?? existing.name,
      imageUrl:
        payload.imageUrl !== undefined ? payload.imageUrl.trim() || undefined : existing.imageUrl,
      websiteUrl:
        payload.websiteUrl !== undefined ? payload.websiteUrl.trim() || undefined : existing.websiteUrl,
      updatedAt: new Date().toISOString()
    };

    this.performersSubject.next(
      current.map((performer) => (performer.id === payload.id ? updated : performer))
    );

    return of(updated);
  }

  deletePerformer(id: string): Observable<void> {
    this.performersSubject.next(this.performersSubject.value.filter((performer) => performer.id !== id));

    return of(void 0);
  }

  private generateId(): string {
    return `performer-${Math.random().toString(36).slice(2, 10)}`;
  }
}
