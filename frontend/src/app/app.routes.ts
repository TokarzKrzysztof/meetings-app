import { Routes } from '@angular/router';
import { AppRoutes } from './utils/enums/app-routes';

export const routes: Routes = [
  { path: AppRoutes.Home, loadComponent: () => import('./pages/home/home.component').then((c) => c.HomeComponent) },
  { path: AppRoutes.Login, loadComponent: () => import('./pages/login/login.component').then((c) => c.LoginComponent) },
  {
    path: AppRoutes.Register,
    loadComponent: () => import('./pages/register/register.component').then((c) => c.RegisterComponent),
  },
  { path: '**', redirectTo: AppRoutes.Home, pathMatch: 'full' },
];
