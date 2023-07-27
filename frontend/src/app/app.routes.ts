import { Routes } from '@angular/router';
import { AppRoutes } from './utils/enums/app-routes';

export const routes: Routes = [
  { path: AppRoutes.Home, loadComponent: () => import('./pages/home/home.component').then((c) => c.HomeComponent) },
  { path: '**', redirectTo: AppRoutes.Home, pathMatch: 'full' },
];
