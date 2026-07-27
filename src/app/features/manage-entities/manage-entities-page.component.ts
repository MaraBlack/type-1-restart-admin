import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';

import {
  CreateModeratorRequest,
  CreatePerformerRequest,
  CreateSponsorRequest,
  Moderator,
  Performer,
  Sponsor,
  SponsorType
} from '../../models';
import { ModeratorsService } from '../../services/moderators.service';
import { PerformersService } from '../../services/performers.service';
import { SponsorsService } from '../../services/sponsors.service';

type EntityTab = 'sponsors' | 'moderators' | 'performers';

@Component({
  selector: 'app-manage-entities-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, SelectModule, TabsModule],
  templateUrl: './manage-entities-page.component.html',
  styleUrl: './manage-entities-page.component.css'
})
export class ManageEntitiesPageComponent {
  private readonly sponsorsService = inject(SponsorsService);
  private readonly moderatorsService = inject(ModeratorsService);
  private readonly performersService = inject(PerformersService);

  protected readonly sponsors$ = this.sponsorsService.getSponsors();
  protected readonly moderators$ = this.moderatorsService.getModerators();
  protected readonly performers$ = this.performersService.getPerformers();
  protected activeTab: EntityTab = 'sponsors';

  protected readonly sponsorTypeOptions: SponsorType[] = [
    'sponsor',
    'partner',
    'mediaPartner',
    'organizer'
  ];

  protected sponsorDraft: CreateSponsorRequest = {
    name: '',
    websiteUrl: '',
    type: 'sponsor'
  };

  protected moderatorDraft: CreateModeratorRequest = {
    name: '',
    imageUrl: ''
  };

  protected performerDraft: CreatePerformerRequest = {
    name: '',
    imageUrl: '',
    websiteUrl: ''
  };

  protected editingSponsorId: string | null = null;
  protected sponsorEditDraft: CreateSponsorRequest = {
    name: '',
    websiteUrl: '',
    type: 'sponsor'
  };

  protected editingModeratorId: string | null = null;
  protected moderatorEditDraft: CreateModeratorRequest = {
    name: '',
    imageUrl: ''
  };

  protected editingPerformerId: string | null = null;
  protected performerEditDraft: CreatePerformerRequest = {
    name: '',
    imageUrl: '',
    websiteUrl: ''
  };

  protected setTab(tab: EntityTab): void {
    this.activeTab = tab;
  }

  protected addSponsor(): void {
    if (!this.sponsorDraft.name.trim()) {
      return;
    }

    this.sponsorsService
      .createSponsor({
        name: this.sponsorDraft.name,
        websiteUrl: this.sponsorDraft.websiteUrl,
        type: this.sponsorDraft.type
      })
      .subscribe(() => {
        this.sponsorDraft = {
          name: '',
          websiteUrl: '',
          type: 'sponsor'
        };
      });
  }

  protected startEditSponsor(item: Sponsor): void {
    this.editingSponsorId = item.id;
    this.sponsorEditDraft = {
      name: item.name,
      websiteUrl: item.websiteUrl,
      type: item.type
    };
  }

  protected saveSponsor(item: Sponsor): void {
    if (!this.sponsorEditDraft.name.trim()) {
      return;
    }

    this.sponsorsService.updateSponsor({ id: item.id, ...this.sponsorEditDraft }).subscribe(() => {
      this.editingSponsorId = null;
    });
  }

  protected deleteSponsor(id: string): void {
    this.sponsorsService.deleteSponsor(id).subscribe();
  }

  protected addModerator(): void {
    if (!this.moderatorDraft.name.trim()) {
      return;
    }

    this.moderatorsService
      .createModerator({
        name: this.moderatorDraft.name,
        imageUrl: this.moderatorDraft.imageUrl
      })
      .subscribe(() => {
        this.moderatorDraft = {
          name: '',
          imageUrl: ''
        };
      });
  }

  protected startEditModerator(item: Moderator): void {
    this.editingModeratorId = item.id;
    this.moderatorEditDraft = {
      name: item.name,
      imageUrl: item.imageUrl
    };
  }

  protected saveModerator(item: Moderator): void {
    if (!this.moderatorEditDraft.name.trim()) {
      return;
    }

    this.moderatorsService
      .updateModerator({ id: item.id, ...this.moderatorEditDraft })
      .subscribe(() => {
        this.editingModeratorId = null;
      });
  }

  protected deleteModerator(id: string): void {
    this.moderatorsService.deleteModerator(id).subscribe();
  }

  protected addPerformer(): void {
    if (!this.performerDraft.name.trim()) {
      return;
    }

    this.performersService
      .createPerformer({
        name: this.performerDraft.name,
        imageUrl: this.performerDraft.imageUrl,
        websiteUrl: this.performerDraft.websiteUrl
      })
      .subscribe(() => {
        this.performerDraft = {
          name: '',
          imageUrl: '',
          websiteUrl: ''
        };
      });
  }

  protected startEditPerformer(item: Performer): void {
    this.editingPerformerId = item.id;
    this.performerEditDraft = {
      name: item.name,
      imageUrl: item.imageUrl,
      websiteUrl: item.websiteUrl
    };
  }

  protected savePerformer(item: Performer): void {
    if (!this.performerEditDraft.name.trim()) {
      return;
    }

    this.performersService
      .updatePerformer({ id: item.id, ...this.performerEditDraft })
      .subscribe(() => {
        this.editingPerformerId = null;
      });
  }

  protected deletePerformer(id: string): void {
    this.performersService.deletePerformer(id).subscribe();
  }

  protected isEditingSponsor(id: string): boolean {
    return this.editingSponsorId === id;
  }

  protected isEditingModerator(id: string): boolean {
    return this.editingModeratorId === id;
  }

  protected isEditingPerformer(id: string): boolean {
    return this.editingPerformerId === id;
  }
}
