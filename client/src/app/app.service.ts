import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {AuthService} from '@modules/auth/services';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor() {
  }

  getAuthTokenFromRefreshToken$ = (): Observable<any> => {
    const refreshToken = AuthService.getRefreshToken$();
    const accessToken = AuthService.getAccessToken$();
    if (refreshToken && AuthService.isTokenExpired(accessToken)
      && !AuthService.isTokenExpired(refreshToken)) {
      return Observable.create((observer: any) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', environment.oauthUrl, true);
        xhr.setRequestHeader('Authorization', 'Basic ' + btoa(`${environment.clientId}:${environment.clientSecret}`));

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 401) {
            observer.next(JSON.parse(xhr.response));
            observer.complete();
          } else {
            observer.error('error happened');
          }
        };

        xhr.onerror = () => {
          observer.error('error happened');
        };
        const formData = new FormData();
        formData.append('refresh_token', refreshToken);
        formData.append('grant_type', 'refresh_token');
        xhr.send(formData);
      });
    }
    return of({});
  }
}
