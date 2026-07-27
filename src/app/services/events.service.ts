import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map, of, throwError } from 'rxjs';


import {
  CreateEventRequest,
  Event,
  EventListItem,
  EventStats,
  UpdateEventRequest
} from '../models/event.model';
import { Moderator, Performer } from '../models';
import { Sponsor } from '../models/sponsor.model';
import { MOCK_IMAGES } from '../mocks/mock-images.data';
import { MOCK_EVENTS } from '../mocks/mock-events.data';
import { ImageAsset } from '../models';
import { ModeratorsService } from './moderators.service';
import { PerformersService } from './performers.service';
import { SponsorsService } from './sponsors.service';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private readonly sponsorsService = inject(SponsorsService);
  private readonly moderatorsService = inject(ModeratorsService);
  private readonly performersService = inject(PerformersService);
  private readonly eventsSubject = new BehaviorSubject<Event[]>(MOCK_EVENTS);
  private readonly images = [...MOCK_IMAGES];

  getEvents(): Observable<EventListItem[]> {
    return this.eventsSubject.asObservable().pipe(
      map((events) =>
        [...events]
          .map((event) => this.toListItem(this.enrichEvent(event)))
          .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
      )
    );
  }

  getEventById(id: string): Observable<Event> {
    return this.eventsSubject.asObservable().pipe(
      map((events) => {
        const event = events.find((item) => item.id === id);

        if (!event) {
          throw new Error(`Event not found: ${id}`);
        }

        return this.enrichEvent(event);
      })
    );
  }

  getStats(): Observable<EventStats> {
    return this.eventsSubject.asObservable().pipe(
      map((events) => ({
        total: events.length,
        published: events.filter((event) => event.status === 'published').length,
        draft: events.filter((event) => event.status === 'draft').length,
        upcoming: events.filter((event) => {
          const eventDate = new Date(event.schedule.startDate).getTime();

          return event.status === 'published' && eventDate >= Date.now();
        }).length
      }))
    );
  }

  getAvailableSponsors(): Observable<Sponsor[]> {
    return this.sponsorsService.getSponsors();
  }

  getAvailablePerformers(): Observable<Performer[]> {
    return this.performersService.getPerformers();
  }

  getAvailableModerators(): Observable<Moderator[]> {
    return this.moderatorsService.getModerators();
  }

  createEvent(payload: CreateEventRequest): Observable<Event> {
    const now = new Date().toISOString();
    const event: Event = {
      id: this.generateId('event'),
      title: payload.title,
      shortDescription: payload.shortDescription,
      description: payload.description,
      category: payload.category,
      status: payload.status,
      schedule: payload.schedule,
      location: payload.location,
      coverImageId: payload.coverImageId,
      coverImageUrl: payload.coverImageUrl,
      socialLinks: payload.socialLinks,
      sponsorIds: [...payload.sponsorIds],
      partners: payload.partners ? [...payload.partners] : [],
      moderatorIds: payload.moderatorIds ? [...payload.moderatorIds] : [],
      performerIds: payload.performerIds ? [...payload.performerIds] : [],
      isFeatured: payload.isFeatured ?? false,
      registrationUrl: payload.registrationUrl,
      publishedAt: payload.status === 'published' ? now : undefined,
      createdAt: now,
      updatedAt: now
    };

    this.setEvents([...this.eventsSubject.value, event]);

    return of(this.enrichEvent(event));
  }

  updateEvent(payload: UpdateEventRequest): Observable<Event> {
    const existingEvent = this.eventsSubject.value.find((item) => item.id === payload.id);

    if (!existingEvent) {
      return throwError(() => new Error(`Event not found: ${payload.id}`));
    }

    const updatedEvent: Event = {
      ...existingEvent,
      ...payload,
      title: payload.title ?? existingEvent.title,
      shortDescription: payload.shortDescription ?? existingEvent.shortDescription,
      description: payload.description ?? existingEvent.description,
      schedule: payload.schedule ?? existingEvent.schedule,
      location: payload.location ?? existingEvent.location,
      sponsorIds: payload.sponsorIds ? [...payload.sponsorIds] : [...existingEvent.sponsorIds],
      partners: payload.partners ? [...payload.partners] : [...existingEvent.partners ?? []],
      moderatorIds:
        payload.moderatorIds ? [...payload.moderatorIds] : [...existingEvent.moderatorIds ?? []],
      performerIds:
        payload.performerIds ? [...payload.performerIds] : [...existingEvent.performerIds ?? []],
      updatedAt: new Date().toISOString(),
      publishedAt:
        payload.status === 'draft'
          ? undefined
          : payload.status === 'published'
            ? existingEvent.publishedAt ?? new Date().toISOString()
            : existingEvent.publishedAt
    };

    this.setEvents(
      this.eventsSubject.value.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );

    return of(this.enrichEvent(updatedEvent));
  }

  publishEvent(id: string): Observable<Event> {
    return this.patchStatus(id, 'published');
  }

  unpublishEvent(id: string): Observable<Event> {
    return this.patchStatus(id, 'draft');
  }

  deleteEvent(id: string): Observable<void> {
    this.setEvents(this.eventsSubject.value.filter((event) => event.id !== id));

    return of(void 0);
  }

  private patchStatus(id: string, status: Event['status']): Observable<Event> {
    const existingEvent = this.eventsSubject.value.find((item) => item.id === id);

    if (!existingEvent) {
      return throwError(() => new Error(`Event not found: ${id}`));
    }

    const now = new Date().toISOString();
    const updatedEvent: Event = {
      ...existingEvent,
      status,
      publishedAt: status === 'published' ? existingEvent.publishedAt ?? now : undefined,
      updatedAt: now
    };

    this.setEvents(
      this.eventsSubject.value.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );

    return of(this.enrichEvent(updatedEvent));
  }

  private enrichEvent(event: Event): Event {
    const coverImage = event.coverImageId ? this.findImage(event.coverImageId) : undefined;
    const sponsors = event.sponsorIds
      .map((sponsorId) => this.findSponsor(sponsorId))
      .filter((sponsor): sponsor is Sponsor => Boolean(sponsor));

    return {
      ...event,
      coverImage,
      sponsors
    };
  }

  private toListItem(event: Event): EventListItem {
    return {
      id: event.id,
      title: event.title,
      category: event.category,
      status: event.status,
      startDate: event.schedule.startDate,
      startTime: event.schedule.startTime,
      type: event.location.type ?? 'offline',
      city: event.location.city,
      coverImageUrl: event.coverImage?.url ?? event.coverImageUrl,
      sponsorCount: event.sponsors?.length ?? event.sponsorIds.length,
      publishedAt: event.publishedAt,
      updatedAt: event.updatedAt,
      isFeatured: event.isFeatured
    };
  }

  private findImage(id: string): ImageAsset | undefined {
    const image = this.images.find((item) => item.id === id);

    return image ? { ...image, alt: { ...image.alt } } : undefined;
  }

  private findSponsor(id: string): Sponsor | undefined {
    const sponsor = this.sponsorsService.getSnapshot().find((item) => item.id === id);

    return sponsor ? { ...sponsor } : undefined;
  }

  private setEvents(events: Event[]): void {
    this.eventsSubject.next(events.map((event) => this.enrichEvent(event)));
  }

  private generateId(prefix: string): string {
    return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
  }
}