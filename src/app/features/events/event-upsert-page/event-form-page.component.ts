import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { SelectModule } from 'primeng/select';

import { EventsService } from '../../../services/events.service';
import { ModeratorsService } from '../../../services/moderators.service';
import { PerformersService } from '../../../services/performers.service';
import {
  Event as AdminEvent,
  EventCategory,
  EventLocationType,
  Moderator,
  Performer,
  Sponsor,
  EventStatus
} from '../../../models';


type EventFormValue = {
  titleRo: string;
  titleEn: string;
  shortDescriptionRo: string;
  shortDescriptionEn: string;
  descriptionRo: string;
  descriptionEn: string;
  category: EventCategory;
  status: EventStatus;
  locationType: EventLocationType;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  city: string;
  locationName: string;
  address: string;
  country: string;
  ticketingUrl: string;
  googleMapsUrl: string;
  registrationUrl: string;
  coverImageUrl: string;
  coverImageSelected: boolean;
  instagramUrl: string;
  facebookUrl: string;
  xUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  sponsors: EventSponsorFormValue[];
  moderatorIds: string[];
  performerIds: string[];
  isFeatured: boolean;
};

type EventSponsorFormValue = {
  name: string;
  logoUrl: string;
  websiteUrl: string;
};

@Component({
  selector: 'app-event-form-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    DialogModule,
    FileUploadModule,
    SelectModule,
    TranslatePipe
  ],
  templateUrl: './event-form-page.component.html',
  styleUrl: './event-form-page.component.css'
})
export class EventFormPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly eventsService = inject(EventsService);
  private readonly moderatorsService = inject(ModeratorsService);
  private readonly performersService = inject(PerformersService);

  protected readonly categoryOptions: EventCategory[] = [
    'conference',
    'workshop',
    'webinar',
    'campaign',
    'community',
    'fundraising',
    'other'
  ];

  protected readonly statusOptions: EventStatus[] = ['draft', 'published'];
  protected readonly locationTypeOptions: EventLocationType[] = ['offline', 'online'];

  protected readonly isEditMode = Boolean(this.route.snapshot.paramMap.get('id'));
  private readonly eventId = this.route.snapshot.paramMap.get('id');
  protected activeMainInfoLang: 'ro' | 'en' = 'ro';
  protected selectedImagePreviewUrl: string | null = null;
  protected sponsorPickerVisible = false;
  protected performerPickerVisible = false;
  protected moderatorPickerVisible = false;
  protected availableSponsors: Sponsor[] = [];
  protected availablePerformers: Performer[] = [];
  protected availableModerators: Moderator[] = [];
  protected selectedAvailableSponsorIds = new Set<string>();
  protected selectedAvailablePerformers = new Set<string>();
  protected selectedAvailableModerators = new Set<string>();
  private readonly optionalUrlValidator: ValidatorFn = (
    control: AbstractControl<string>
  ): ValidationErrors | null => {
    const value = (control.value ?? '').trim();

    if (!value) {
      return null;
    }

    return /^(https?:\/\/|blob:).+/i.test(value) ? null : { invalidUrl: true };
  };

  protected readonly form = this.fb.nonNullable.group({
    titleRo: ['', Validators.required],
    titleEn: ['', Validators.required],
    shortDescriptionRo: ['', Validators.required],
    shortDescriptionEn: ['', Validators.required],
    descriptionRo: ['', Validators.required],
    descriptionEn: ['', Validators.required],
    category: ['conference' as EventCategory, Validators.required],
    status: ['draft' as EventStatus, Validators.required],
    locationType: ['offline' as EventLocationType, Validators.required],
    startDate: ['', Validators.required],
    startTime: ['', Validators.required],
    endDate: [''],
    endTime: ['', Validators.required],
    city: ['', Validators.required],
    locationName: ['', Validators.required],
    address: ['', Validators.required],
    country: ['Romania', Validators.required],
    ticketingUrl: ['', this.optionalUrlValidator],
    googleMapsUrl: ['', this.optionalUrlValidator],
    registrationUrl: ['', this.optionalUrlValidator],
    coverImageUrl: ['', [Validators.required, this.optionalUrlValidator]],
    coverImageSelected: [false, Validators.requiredTrue],
    instagramUrl: ['', this.optionalUrlValidator],
    facebookUrl: ['', this.optionalUrlValidator],
    xUrl: ['', this.optionalUrlValidator],
    youtubeUrl: ['', this.optionalUrlValidator],
    linkedinUrl: ['', this.optionalUrlValidator],
    sponsors: this.fb.array<FormGroup>([]),
    moderatorIds: this.fb.array<string>([], [Validators.minLength(1)]),
    performerIds: this.fb.array<string>([]),
    isFeatured: [false]
  });

  ngOnInit(): void {
    this.eventsService.getAvailableSponsors().subscribe((sponsors) => {
      this.availableSponsors = sponsors;
    });
    this.performersService.getPerformers().subscribe((performers) => {
      this.availablePerformers = performers;
    });
    this.moderatorsService.getModerators().subscribe((moderators) => {
      this.availableModerators = moderators;
    });

    this.updateLocationValidators(this.form.controls.locationType.value);
    this.form.controls.locationType.valueChanges.subscribe((locationType) => {
      this.updateLocationValidators(locationType);
    });

    if (!this.eventId) {
      this.form.patchValue({
        status: 'draft',
        locationType: 'offline',
        isFeatured: false
      });
      this.activeMainInfoLang = 'ro';
      this.selectedImagePreviewUrl = null;

      return;
    }

    this.eventsService.getEventById(this.eventId).subscribe((event) => {
      this.form.patchValue(this.toFormValue(event));
      this.selectedImagePreviewUrl = event.coverImage?.url ?? event.coverImageUrl ?? null;
      this.form.controls.coverImageSelected.setValue(Boolean(this.selectedImagePreviewUrl));

      this.form.controls.moderatorIds.clear();
      this.resolveModeratorIds(event).forEach((moderatorId) => this.addModeratorId(moderatorId));

      this.form.controls.performerIds.clear();
      this.resolvePerformerIds(event).forEach((performerId) => this.addPerformerId(performerId));

      const partners = event.partners?.length ? event.partners : [];
      this.form.controls.sponsors.clear();
      partners.forEach((partner) => {
        this.form.controls.sponsors.push(
          this.createSponsorGroup(partner.name, partner.logoUrl ?? '', partner.websiteUrl ?? '')
        );
      });
    });
  }

  protected get moderatorIdsArray(): FormArray {
    return this.form.controls.moderatorIds;
  }

  protected get sponsorsArray(): FormArray<FormGroup> {
    return this.form.controls.sponsors;
  }

  protected get performerIdsArray(): FormArray {
    return this.form.controls.performerIds;
  }

  protected get isOnlineEvent(): boolean {
    return this.form.controls.locationType.value === 'online';
  }

  protected addModeratorId(value: string): void {
    this.form.controls.moderatorIds.push(this.fb.nonNullable.control(value));
  }

  protected openModeratorPicker(): void {
    this.selectedAvailableModerators = new Set(
      this.moderatorIdsArray.controls
        .map((control) => String(control.value ?? '').trim())
        .filter((value) => value.length > 0)
    );
    this.moderatorPickerVisible = true;
  }

  protected closeModeratorPicker(): void {
    this.moderatorPickerVisible = false;
  }

  protected toggleAvailableModeratorSelection(moderatorId: string, checked: boolean): void {
    if (checked) {
      this.selectedAvailableModerators.add(moderatorId);

      return;
    }

    this.selectedAvailableModerators.delete(moderatorId);
  }

  protected isAvailableModeratorSelected(moderatorId: string): boolean {
    return this.selectedAvailableModerators.has(moderatorId);
  }

  protected addSelectedModeratorsToList(): void {
    const existing = new Set(
      this.moderatorIdsArray.controls
        .map((control) => String(control.value ?? '').trim())
        .filter((value) => value.length > 0)
    );

    this.availableModerators.forEach((moderator) => {
      if (!this.selectedAvailableModerators.has(moderator.id) || existing.has(moderator.id)) {
        return;
      }

      this.addModeratorId(moderator.id);
      existing.add(moderator.id);
    });

    this.moderatorPickerVisible = false;
  }

  protected removeModerator(index: number): void {
    this.form.controls.moderatorIds.removeAt(index);
  }

  protected addPerformerId(value: string): void {
    this.form.controls.performerIds.push(this.fb.nonNullable.control(value));
  }

  protected removePerformer(index: number): void {
    this.form.controls.performerIds.removeAt(index);
  }

  protected openPerformerPicker(): void {
    this.selectedAvailablePerformers = new Set(
      this.performerIdsArray.controls
        .map((control) => String(control.value ?? '').trim())
        .filter((value) => value.length > 0)
    );
    this.performerPickerVisible = true;
  }

  protected closePerformerPicker(): void {
    this.performerPickerVisible = false;
  }

  protected toggleAvailablePerformerSelection(performerId: string, checked: boolean): void {
    if (checked) {
      this.selectedAvailablePerformers.add(performerId);

      return;
    }

    this.selectedAvailablePerformers.delete(performerId);
  }

  protected isAvailablePerformerSelected(performerId: string): boolean {
    return this.selectedAvailablePerformers.has(performerId);
  }

  protected addSelectedPerformersToList(): void {
    const existing = new Set(
      this.performerIdsArray.controls
        .map((control) => String(control.value ?? '').trim())
        .filter((value) => value.length > 0)
    );

    this.availablePerformers.forEach((performer) => {
      if (!this.selectedAvailablePerformers.has(performer.id) || existing.has(performer.id)) {
        return;
      }

      this.addPerformerId(performer.id);
      existing.add(performer.id);
    });

    this.performerPickerVisible = false;
  }

  protected getModeratorById(id: string): Moderator | undefined {
    return this.availableModerators.find((moderator) => moderator.id === id);
  }

  protected getPerformerById(id: string): Performer | undefined {
    return this.availablePerformers.find((performer) => performer.id === id);
  }

  protected removeSponsor(index: number): void {
    this.form.controls.sponsors.removeAt(index);
  }

  protected openSponsorPicker(): void {
    this.selectedAvailableSponsorIds.clear();

    this.sponsorsArray.controls.forEach((control) => {
      const sponsorName = String(control.value.name ?? '').toLowerCase().trim();
      const matchedSponsor = this.availableSponsors.find(
        (sponsor) => sponsor.name.toLowerCase().trim() === sponsorName
      );

      if (matchedSponsor) {
        this.selectedAvailableSponsorIds.add(matchedSponsor.id);
      }
    });

    this.sponsorPickerVisible = true;
  }

  protected closeSponsorPicker(): void {
    this.sponsorPickerVisible = false;
  }

  protected toggleAvailableSponsorSelection(sponsorId: string, checked: boolean): void {
    if (checked) {
      this.selectedAvailableSponsorIds.add(sponsorId);

      return;
    }

    this.selectedAvailableSponsorIds.delete(sponsorId);
  }

  protected isAvailableSponsorSelected(sponsorId: string): boolean {
    return this.selectedAvailableSponsorIds.has(sponsorId);
  }

  protected addSelectedSponsorsToList(): void {
    const existingKeys = new Set(
      this.sponsorsArray.controls.map((control) => {
        const name = String(control.value.name ?? '').toLowerCase().trim();
        const website = String(control.value.websiteUrl ?? '').toLowerCase().trim();

        return `${name}|${website}`;
      })
    );

    this.availableSponsors.forEach((sponsor) => {
      if (!this.selectedAvailableSponsorIds.has(sponsor.id)) {
        return;
      }

      const key = `${sponsor.name.toLowerCase().trim()}|${(sponsor.websiteUrl ?? '').toLowerCase().trim()}`;

      if (existingKeys.has(key)) {
        return;
      }

      this.sponsorsArray.push(this.createSponsorGroup(sponsor.name, '', sponsor.websiteUrl ?? ''));
      existingKeys.add(key);
    });

    this.sponsorPickerVisible = false;
  }

  protected onImageSelect(event: { files?: File[] }): void {
    const file = event.files?.[0];

    if (!file) {
      return;
    }

    this.selectedImagePreviewUrl = URL.createObjectURL(file);
    this.form.controls.coverImageUrl.setValue(this.selectedImagePreviewUrl);
    this.form.controls.coverImageUrl.markAsDirty();
    this.form.controls.coverImageUrl.updateValueAndValidity();
    this.form.controls.coverImageSelected.setValue(true);
    this.form.controls.coverImageSelected.markAsDirty();
    this.form.controls.coverImageSelected.updateValueAndValidity();
  }

  protected onImageRemove(): void {
    this.selectedImagePreviewUrl = null;
    this.form.controls.coverImageUrl.setValue('');
    this.form.controls.coverImageUrl.markAsDirty();
    this.form.controls.coverImageUrl.updateValueAndValidity();
    this.form.controls.coverImageSelected.setValue(false);
    this.form.controls.coverImageSelected.markAsDirty();
    this.form.controls.coverImageSelected.updateValueAndValidity();
  }

  protected cancel(): void {
    void this.router.navigate(['/events']);
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue() as EventFormValue;
    const moderatorIds = formValue.moderatorIds
      .map((moderatorId) => moderatorId.trim())
      .filter((moderatorId) => moderatorId.length > 0);
    const performerIds = formValue.performerIds
      .map((performerId) => performerId.trim())
      .filter((performerId) => performerId.length > 0);
    const partners = formValue.sponsors
      .map((sponsor) => ({
        name: sponsor.name.trim(),
        logoUrl: sponsor.logoUrl.trim() || undefined,
        websiteUrl: sponsor.websiteUrl.trim() || undefined
      }))
      .filter((partner) => partner.name.length > 0);

    const location = formValue.locationType === 'online'
      ? {
        name: formValue.locationName || 'Online',
        type: 'online' as EventLocationType,
        ticketingUrl: formValue.ticketingUrl || undefined,
        country: formValue.country || undefined
      }
      : {
        name: formValue.locationName,
        type: 'offline' as EventLocationType,
        address: formValue.address,
        city: formValue.city,
        country: formValue.country,
        googleMapsUrl: formValue.googleMapsUrl || undefined
      };

    const payload = {
      title: {
        ro: formValue.titleRo,
        en: formValue.titleEn
      },
      shortDescription: {
        ro: formValue.shortDescriptionRo,
        en: formValue.shortDescriptionEn
      },
      description: {
        ro: formValue.descriptionRo,
        en: formValue.descriptionEn
      },
      category: formValue.category,
      status: formValue.status,
      schedule: {
        startDate: formValue.startDate,
        startTime: formValue.startTime,
        endDate: formValue.endDate || undefined,
        endTime: formValue.endTime
      },
      location,
      sponsorIds: [],
      partners,
      coverImageUrl: formValue.coverImageUrl || this.selectedImagePreviewUrl || '',
      socialLinks: {
        instagramUrl: formValue.instagramUrl || undefined,
        facebookUrl: formValue.facebookUrl || undefined,
        xUrl: formValue.xUrl || undefined,
        youtubeUrl: formValue.youtubeUrl || undefined,
        linkedinUrl: formValue.linkedinUrl || undefined
      },
      moderatorIds,
      performerIds,
      registrationUrl: formValue.registrationUrl || undefined,
      isFeatured: formValue.isFeatured
    };

    const request = this.isEditMode && this.eventId
      ? this.eventsService.updateEvent({ id: this.eventId, ...payload })
      : this.eventsService.createEvent(payload);

    request.subscribe(() => {
      void this.router.navigate(['/events']);
    });
  }

  protected hasControlError(controlName: keyof typeof this.form.controls, errorCode: string): boolean {
    const control = this.form.controls[controlName];

    return control.hasError(errorCode) && (control.touched || control.dirty);
  }

  protected getControlHint(controlName: keyof typeof this.form.controls, label: string): string {
    if (this.hasControlError(controlName, 'required')) {
      return `${label} este mandatory field.`;
    }

    if (this.hasControlError(controlName, 'invalidUrl')) {
      return `${label} trebuie sa fie URL valid (http:// sau https://).`;
    }

    return '';
  }

  protected isControlInvalid(controlName: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[controlName];

    return control.invalid && (control.touched || control.dirty);
  }

  protected hasModeratorRequiredError(): boolean {
    return this.moderatorIdsArray.invalid && (this.moderatorIdsArray.touched || this.moderatorIdsArray.dirty);
  }

  private toFormValue(event: AdminEvent): Partial<EventFormValue> {
    return {
      titleRo: event.title.ro,
      titleEn: event.title.en,
      shortDescriptionRo: event.shortDescription.ro,
      shortDescriptionEn: event.shortDescription.en,
      descriptionRo: event.description.ro,
      descriptionEn: event.description.en,
      category: event.category,
      status: event.status,
      locationType: event.location.type ?? 'offline',
      startDate: event.schedule.startDate,
      startTime: event.schedule.startTime ?? '',
      endDate: event.schedule.endDate ?? '',
      endTime: event.schedule.endTime ?? '',
      city: event.location.city ?? '',
      locationName: event.location.name,
      address: event.location.address ?? '',
      country: event.location.country ?? 'Romania',
      ticketingUrl: event.location.ticketingUrl ?? '',
      googleMapsUrl: event.location.googleMapsUrl ?? '',
      registrationUrl: event.registrationUrl ?? '',
      coverImageUrl: event.coverImage?.url ?? event.coverImageUrl ?? '',
      instagramUrl: event.socialLinks?.instagramUrl ?? '',
      facebookUrl: event.socialLinks?.facebookUrl ?? '',
      xUrl: event.socialLinks?.xUrl ?? '',
      youtubeUrl: event.socialLinks?.youtubeUrl ?? '',
      linkedinUrl: event.socialLinks?.linkedinUrl ?? '',
      moderatorIds: this.resolveModeratorIds(event),
      performerIds: this.resolvePerformerIds(event),
      isFeatured: event.isFeatured ?? false
    };
  }

  private resolveModeratorIds(event: AdminEvent): string[] {
    return event.moderatorIds?.length ? [...event.moderatorIds] : [];
  }

  private resolvePerformerIds(event: AdminEvent): string[] {
    return event.performerIds?.length ? [...event.performerIds] : [];
  }

  private updateLocationValidators(locationType: EventLocationType): void {
    if (locationType === 'online') {
      this.form.controls.ticketingUrl.setValidators([Validators.required, this.optionalUrlValidator]);
      this.form.controls.address.clearValidators();
      this.form.controls.city.clearValidators();
      this.form.controls.locationName.clearValidators();
      this.form.controls.country.clearValidators();
    } else {
      this.form.controls.ticketingUrl.setValidators([this.optionalUrlValidator]);
      this.form.controls.address.setValidators([Validators.required]);
      this.form.controls.city.setValidators([Validators.required]);
      this.form.controls.locationName.setValidators([Validators.required]);
      this.form.controls.country.setValidators([Validators.required]);
    }

    this.form.controls.ticketingUrl.updateValueAndValidity({ emitEvent: false });
    this.form.controls.address.updateValueAndValidity({ emitEvent: false });
    this.form.controls.city.updateValueAndValidity({ emitEvent: false });
    this.form.controls.locationName.updateValueAndValidity({ emitEvent: false });
    this.form.controls.country.updateValueAndValidity({ emitEvent: false });
  }

  private createSponsorGroup(name = '', logoUrl = '', websiteUrl = ''): FormGroup {
    return this.fb.nonNullable.group({
      name: [name],
      logoUrl: [logoUrl, this.optionalUrlValidator],
      websiteUrl: [websiteUrl, this.optionalUrlValidator]
    });
  }
}