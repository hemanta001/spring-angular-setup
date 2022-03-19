import {Injectable} from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {AuthService} from '@modules/auth/services';
import {filter, switchMap, take} from 'rxjs/operators';
import {AppService} from '@app/app.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  subject = new BehaviorSubject<boolean>(false);
  token!: string;
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(private http: HttpClient, private appService: AppService
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = AuthService.getAccessToken$();
    if (token) {
      this.token = token;
    }
    if (this.token) {
      return this.handleSecureRequest(req, next);
    }
    return next.handle(req);
  }

  handleSecureRequest(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (AuthService.isTokenExpired(this.token)) {
      if (this.refreshTokenInProgress) {
        // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
        // – which means the new token is ready and we can retry the request again
        return this.refreshTokenSubject.pipe(
          filter(token => token != null),
          take(1),
          switchMap(() => next.handle(this.addAuthenticationToken(request)))
        );
      }
      this.refreshTokenInProgress = true;

      // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
      this.refreshTokenSubject.next(null);

      // Call auth.refreshAccessToken(this is an Observable that will be returned)
      return this.appService.getAuthTokenFromRefreshToken$()
        .pipe(switchMap((token: any) => {
          this.token = token.access_token;
          const refreshToken = token.refresh_token;
          if (this.token && refreshToken) {
            AuthService.setAccessToken$(this.token);
            AuthService.setRefreshToken$(refreshToken);
            this.refreshTokenInProgress = false;
            this.refreshTokenSubject.next(this.token);
            return next.handle(this.addAuthenticationToken(request));
          } else {
            this.refreshTokenInProgress = false;
            alert('Session is in-active.Please,reload the page');
            AuthService.removeAccessToken$();
            AuthService.removeRefreshToken$();
            location.reload();
            return Observable.throw(this.token);
          }
        }));
    }
    return next.handle(this.addAuthenticationToken(request));
  }


  addAuthenticationToken(request: HttpRequest<any>) {
    const accessToken = AuthService.getAccessToken$();
    // If access token is null this means that user is not logged in
    // And we return the original request
    if (!accessToken) {
      return request;
    }

    // We clone the request, because the original request is immutable
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      }
    });
  }

}
