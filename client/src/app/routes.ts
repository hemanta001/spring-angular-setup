import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/dashboard',
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('modules/dashboard/dashboard.module').then(
        m => m.DashboardModule,
      ),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('modules/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'error',
    loadChildren: () =>
      import('modules/error/error.module').then(m => m.ErrorModule),
  },
  {
    path: 'tables',
    loadChildren: () =>
      import('modules/tables/tables.module').then(m => m.TablesModule),
  },
  {
    path: 'version',
    loadChildren: () =>
      import('modules/utility/utility.module').then(m => m.UtilityModule),
  },
  {
    path: '**',
    pathMatch: 'full',
    loadChildren: () =>
      import('modules/error/error.module').then(m => m.ErrorModule),
  },
];

export default routes;
