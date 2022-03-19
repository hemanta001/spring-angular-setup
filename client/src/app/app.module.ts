import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthGuard} from '@modules/auth/guards';
import {AuthService, UserService} from '@modules/auth/services';
import {ToastrModule} from 'ngx-toastr';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {JwtInterceptor} from '@modules/auth/interceptor/jwt.interceptor';
import {AppService} from '@app/app.service';
import {HashLocationStrategy, LocationStrategy} from "@angular/common";

export function appInitializerFn(appService: AppService) {
  return () => new Promise(resolve => {
    // attempt to refresh token on app start up to auto authenticate
    appService.getAuthTokenFromRefreshToken$()
      .subscribe(data => {
        const accessToken = data.access_token;
        const refreshToken = data.refresh_token;
        if (accessToken && refreshToken) {
          AuthService.setAccessToken$(accessToken);
          AuthService.setRefreshToken$(refreshToken);
        }
      })
      .add(resolve);
  });
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, BrowserAnimationsModule,
    ToastrModule.forRoot()],
  providers: [AuthGuard, UserService, AppService, {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: APP_INITIALIZER, useFactory: appInitializerFn, multi: true, deps: [AppService]},
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
