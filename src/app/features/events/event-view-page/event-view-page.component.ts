import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';

import { Event as AdminEvent } from '../../../models';
import { EventsService } from '../../../services/events.service';
import { ModeratorsService } from '../../../services/moderators.service';
import { PerformersService } from '../../../services/performers.service';

@Component({
  selector: 'app-event-view-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './event-view-page.component.html',
  styleUrl: './event-view-page.component.css'
})
export class EventViewPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly eventsService = inject(EventsService);
  private readonly moderatorsService = inject(ModeratorsService);
  private readonly performersService = inject(PerformersService);

  private readonly eventId = this.route.snapshot.paramMap.get('id');
  protected loadError = '';
  protected readonly fallbackCoverUrl = 'https://placehold.co/1120x320?text=Event+Cover';

  protected readonly event$: Observable<AdminEvent | null> = this.eventId
    ? this.eventsService.getEventById(this.eventId).pipe(
      catchError(() => {
        this.loadError = 'Evenimentul nu a fost gasit.';

        return of(null);
      })
    )
    : of(null);

  protected openEdit(event: AdminEvent): void {
    this.router.navigate(['/events', event.id, 'edit']);
  }

  protected formatDate(value?: string): string {
    if (!value) {
      return '-';
    }

    return new Date(value).toLocaleString('ro-RO');
  }

  protected formatDateOnly(value?: string): string {
    if (!value) {
      return '-';
    }

    return new Date(value).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  protected formatTimeRange(event: AdminEvent): string {
    const start = event.schedule.startTime;
    const end = event.schedule.endTime;

    if (!start && !end) {
      return '-';
    }

    if (start && end) {
      return `${start} - ${end}`;
    }

    return start ?? end ?? '-';
  }

  protected getCoverUrl(event: AdminEvent): string {
    return event.coverImage?.url || event.coverImageUrl || this.fallbackCoverUrl;
  }

  protected formatBool(value?: boolean): string {
    if (value === undefined) {
      return '-';
    }

    return value ? 'Da' : 'Nu';
  }

  protected joinList(values?: string[]): string {
    if (!values || values.length === 0) {
      return '-';
    }

    return values.join(', ');
  }

  protected getModeratorNameById(id: string): string {
    return this.moderatorsService.getSnapshot().find((item) => item.id === id)?.name ?? id;
  }

  protected getModeratorImageById(id: string): string | undefined {
    return this.moderatorsService.getSnapshot().find((item) => item.id === id)?.imageUrl;
  }

  protected getPerformerNameById(id: string): string {
    return this.performersService.getSnapshot().find((item) => item.id === id)?.name ?? id;
  }

  protected getPerformerImageById(id: string): string | undefined {
    return this.performersService.getSnapshot().find((item) => item.id === id)?.imageUrl;
  }
}
