import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SBRouteData} from '@modules/navigation/models';
import * as userContainers from '@modules/user/containers';
import {UserModule} from '@modules/user/user.module';


const routes: Routes = [{
  path: 'create',
  data: {
    breadcrumbs: [
      {
        text: 'Create',
        active: true,
      },
    ],
  } as SBRouteData,
  component: userContainers.CreateComponent,
},
  {
    path: 'list',
    data: {
      breadcrumbs: [
        {
          text: 'List',
          active: true,
        },
      ],
    } as SBRouteData,
    canActivate: [],
    component: userContainers.ListComponent,
  },
  {
    path: 'edit/:_id',
    data: {
      breadcrumbs: [
        {
          text: 'edit',
          active: true,
        },
      ],
    } as SBRouteData,
    canActivate: [],
    component: userContainers.CreateComponent,
  }

];
@NgModule({
  imports: [UserModule, RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
