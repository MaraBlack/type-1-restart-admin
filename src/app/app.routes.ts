import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'events'
  },
  {
    path: 'events',
    loadComponent: () =>
      import('./features/events/events-page/events-page.component').then(
        (module) => module.EventsPageComponent
      )
  },
  {
    path: 'events/new',
    loadComponent: () =>
      import('./features/events/event-upsert-page/event-form-page.component').then(
        (module) => module.EventFormPageComponent
      )
  },
  {
    path: 'events/:id/edit',
    loadComponent: () =>
      import('./features/events/event-upsert-page/event-form-page.component').then(
        (module) => module.EventFormPageComponent
      )
  },
  {
    path: 'events/:id/view',
    loadComponent: () =>
      import('./features/events/event-view-page/event-view-page.component').then(
        (module) => module.EventViewPageComponent
      )
  },
  {
    path: 'manage-entities',
    loadComponent: () =>
      import('./features/manage-entities/manage-entities-page.component').then(
        (module) => module.ManageEntitiesPageComponent
      )
  },
  {
    path: 'admin/events',
    pathMatch: 'full',
    redirectTo: 'events'
  },
  {
    path: 'admin/events/new',
    pathMatch: 'full',
    redirectTo: 'events/new'
  },
  {
    path: 'admin/events/:id/edit',
    loadComponent: () =>
      import('./features/events/event-upsert-page/event-form-page.component').then(
        (module) => module.EventFormPageComponent
      )
  },
  {
    path: 'admin/events/:id/view',
    pathMatch: 'full',
    redirectTo: 'events/:id/view'
  },
  {
    path: '**',
    redirectTo: 'events'
  }
];
