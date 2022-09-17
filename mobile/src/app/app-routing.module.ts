import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppRoutes } from './utils/enums/app-routes';

const routes: Routes = [
  {
    path: AppRoutes.Login,
    loadChildren: () =>
      import('./pages/auth/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: AppRoutes.Register,
    loadChildren: () =>
      import('./pages/auth/register/register.module').then((m) => m.RegisterPageModule),
  },
  {
    path: '',
    redirectTo: AppRoutes.Login,
    pathMatch: 'full',
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
