import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    // redirectTo: 'page/1',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'page/:page',
    pathMatch: 'full',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'kontakt',
    loadComponent: () =>
      import('./contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: ':slug',
    loadComponent: () =>
      import('./article/article.component').then((m) => m.ArticleComponent),
  },
]
