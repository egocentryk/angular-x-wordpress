import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'kontakt',
    loadComponent: () => import('./contact/contact.component').then((m) => m.ContactComponent)
  }
];
