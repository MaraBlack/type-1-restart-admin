import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';

import { CreateSponsorRequest, Sponsor, UpdateSponsorRequest } from '../models/sponsor.model';
import { MOCK_SPONSORS } from '../mocks/mock-sponsors.data';

@Injectable({ providedIn: 'root' })
export class SponsorsService {
  private readonly sponsorsSubject = new BehaviorSubject<Sponsor[]>(MOCK_SPONSORS);

  getSponsors(): Observable<Sponsor[]> {
    return this.sponsorsSubject.asObservable();
  }

  getSnapshot(): Sponsor[] {
    return this.sponsorsSubject.value;
  }

  getSponsorById(id: string): Observable<Sponsor | undefined> {
    const sponsor = this.sponsorsSubject.value.find((item) => item.id === id);

    return of(sponsor ? { ...sponsor } : undefined);
  }

  createSponsor(payload: CreateSponsorRequest): Observable<Sponsor> {
    const now = new Date().toISOString();
    const sponsor: Sponsor = {
      id: this.generateId('sponsor'),
      name: payload.name.trim(),
      slug: this.slugify(payload.name),
      logoImageURL: payload.logoImageURL,
      websiteUrl: payload.websiteUrl?.trim() || undefined,
      type: payload.type,
      createdAt: now,
      updatedAt: now
    };

    this.sponsorsSubject.next([...this.sponsorsSubject.value, sponsor]);

    return of({ ...sponsor });
  }

  updateSponsor(payload: UpdateSponsorRequest): Observable<Sponsor> {
    const current = this.sponsorsSubject.value;
    const existingSponsor = current.find((item) => item.id === payload.id);

    if (!existingSponsor) {
      return throwError(() => new Error(`Sponsor not found: ${payload.id}`));
    }

    const nextName = payload.name?.trim() ?? existingSponsor.name;

    const updatedSponsor: Sponsor = {
      ...existingSponsor,
      ...payload,
      name: nextName,
      slug: this.slugify(nextName),
      websiteUrl:
        payload.websiteUrl !== undefined
          ? payload.websiteUrl.trim() || undefined
          : existingSponsor.websiteUrl,
      updatedAt: new Date().toISOString()
    };

    this.sponsorsSubject.next(
      current.map((sponsor) => (sponsor.id === updatedSponsor.id ? updatedSponsor : sponsor))
    );

    return of({ ...updatedSponsor });
  }

  deleteSponsor(id: string): Observable<void> {
    this.sponsorsSubject.next(this.sponsorsSubject.value.filter((sponsor) => sponsor.id !== id));

    return of(void 0);
  }

  private generateId(prefix: string): string {
    return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}