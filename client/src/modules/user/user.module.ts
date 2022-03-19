import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Components */
import * as userComponents from './components';

/* Containers */
import * as userContainers from './containers';

/* Guards */
import * as userGuards from './guards';

/* Services */
import * as userServices from './services';

import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppCommonModule} from '@common/app-common.module';
import {NavigationModule} from '@modules/navigation/navigation.module';
import {TablesModule} from '@modules/tables/tables.module';
import {NgSelectModule} from '@ng-select/ng-select';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        AppCommonModule,
        NavigationModule,
        TablesModule,
        NgSelectModule,
    ],
  providers: [...userServices.services, ...userGuards.guards],
  declarations: [...userContainers.containers, ...userComponents.components],
  exports: [...userContainers.containers, ...userComponents.components],
})
export class UserModule { }
