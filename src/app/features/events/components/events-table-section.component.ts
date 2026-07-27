import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { EventListItem, EventStatus } from '../../../models';




@Component({
  selector: 'app-events-table-section',
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, TagModule, TooltipModule, TranslatePipe],
  templateUrl: './events-table-section.component.html',
  styleUrl: './events-table-section.component.css'
})
export class EventsTableSectionComponent {
  @Input() events: EventListItem[] | null = [];
  @Output() view = new EventEmitter<EventListItem>();
  @Output() edit = new EventEmitter<EventListItem>();
  @Output() delete = new EventEmitter<EventListItem>();
  @Output() publish = new EventEmitter<EventListItem>();
  @Output() unpublish = new EventEmitter<EventListItem>();

  protected isPublished(event: EventListItem): boolean {
    return event.status === 'published';
  }

  protected isDraft(event: EventListItem): boolean {
    return event.status === 'draft';
  }

  protected statusSeverity(status: EventStatus): 'success' | 'info' | 'warn' | 'danger' {
    if (status === 'published') {
      return 'success';
    }

    return 'warn';
  }

  protected formatDate(dateValue: string): string {
    return new Intl.DateTimeFormat('ro-RO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(dateValue));
  }
}