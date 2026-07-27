import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';


import { EventsService } from '../../../services/events.service';

import { EventListItem } from '../../../models';
import { EventsTableSectionComponent } from '../components/events-table-section.component';


@Component({
  selector: 'app-events-page',
  standalone: true,
  imports: [CommonModule, ButtonModule, TranslatePipe, EventsTableSectionComponent],
  templateUrl: './events-page.component.html',
  styleUrls: ['./events-page.component.css']
})
export class EventsPageComponent {
  private readonly router = inject(Router);
  private readonly eventsService = inject(EventsService);

  protected readonly events$ = this.eventsService.getEvents();
  protected readonly stats$ = this.eventsService.getStats();

  protected createEvent(): void {
    this.router.navigate(['/events/new']);
  }

  protected openManageEntities(): void {
    this.router.navigate(['/manage-entities']);
  }

  protected viewEvent(event: EventListItem): void {
    this.router.navigate(['/events', event.id, 'view']);
  }

  protected editEvent(event: EventListItem): void {
    this.router.navigate(['/events', event.id, 'edit']);
  }

  protected deleteEvent(event: EventListItem): void {
    const shouldDelete = window.confirm(`Delete "${event.title.ro}"?`);

    if (!shouldDelete) {
      return;
    }

    this.eventsService.deleteEvent(event.id).subscribe();
  }

  protected publishEvent(event: EventListItem): void {
    this.eventsService.publishEvent(event.id).subscribe();
  }

  protected unpublishEvent(event: EventListItem): void {
    this.eventsService.unpublishEvent(event.id).subscribe();
  }
}