import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '@modules/auth/guards';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    redirectTo: '/dashboard',
  },
  {
    path: 'dashboard',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('modules/dashboard/dashboard-routing.module').then(
        m => m.DashboardRoutingModule
      ),
  }
  ,
  {
    path: 'user',
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('modules/user/user-routing.module').then(m => m.UserRoutingModule),
  },

  {
    path: 'auth',
    loadChildren: () =>
      import('modules/auth/auth-routing.module').then(m => m.AuthRoutingModule),
  },
  {
    path: 'error',
    loadChildren: () =>
      import('modules/error/error-routing.module').then(m => m.ErrorRoutingModule),
  },
  // {
  //   path: 'tables',
  //   canLoad: [AuthGuard],
  //   canActivate: [AuthGuard],
  //   loadChildren: () =>
  //     import('modules/tables/tables-routing.module').then(m => m.TablesRoutingModule),
  // },
  {
    path: 'version',
    loadChildren: () =>
      import('modules/utility/utility-routing.module').then(m => m.UtilityRoutingModule),
  },
  {
    path: '**',
    pathMatch: 'full',
    loadChildren: () =>
      import('modules/error/error-routing.module').then(m => m.ErrorRoutingModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
