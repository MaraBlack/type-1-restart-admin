import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';

import {
  CreateModeratorRequest,
  Moderator,
  UpdateModeratorRequest
} from '../models/moderator.model';
import { MOCK_MODERATORS } from '../mocks/mock-moderators.data';

@Injectable({ providedIn: 'root' })
export class ModeratorsService {
  private readonly moderatorsSubject = new BehaviorSubject<Moderator[]>(MOCK_MODERATORS);

  getModerators(): Observable<Moderator[]> {
    return this.moderatorsSubject.asObservable();
  }

  getSnapshot(): Moderator[] {
    return this.moderatorsSubject.value;
  }

  createModerator(payload: CreateModeratorRequest): Observable<Moderator> {
    const now = new Date().toISOString();
    const moderator: Moderator = {
      id: this.generateId(),
      name: payload.name.trim(),
      imageUrl: payload.imageUrl?.trim() || undefined,
      createdAt: now,
      updatedAt: now
    };

    this.moderatorsSubject.next([...this.moderatorsSubject.value, moderator]);

    return of(moderator);
  }

  updateModerator(payload: UpdateModeratorRequest): Observable<Moderator> {
    const current = this.moderatorsSubject.value;
    const existing = current.find((moderator) => moderator.id === payload.id);

    if (!existing) {
      return throwError(() => new Error(`Moderator not found: ${payload.id}`));
    }

    const updated: Moderator = {
      ...existing,
      ...payload,
      name: payload.name?.trim() ?? existing.name,
      imageUrl:
        payload.imageUrl !== undefined ? payload.imageUrl.trim() || undefined : existing.imageUrl,
      updatedAt: new Date().toISOString()
    };

    this.moderatorsSubject.next(
      current.map((moderator) => (moderator.id === payload.id ? updated : moderator))
    );

    return of(updated);
  }

  deleteModerator(id: string): Observable<void> {
    this.moderatorsSubject.next(this.moderatorsSubject.value.filter((moderator) => moderator.id !== id));

    return of(void 0);
  }

  private generateId(): string {
    return `moderator-${Math.random().toString(36).slice(2, 10)}`;
  }
}
