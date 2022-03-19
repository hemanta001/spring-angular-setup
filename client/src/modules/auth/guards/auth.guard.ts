import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment
} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService, UserService} from '@modules/auth/services';
import jwtDecode from 'jwt-decode';
import {sideNavItems} from '@modules/navigation/data';
import {User} from '@modules/auth/models';
import {AppService} from '@app/app.service';

@Injectable()
export class AuthGuard implements CanLoad, CanActivate {

  constructor(private router: Router, private userService: UserService, private appService: AppService) {
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
    console.log(route);
    console.log(segments);
    let url = '';
    if (segments) {
      segments.forEach(segment => {
        url += `/${segment}`;
      });
    }
    return this.checkIfExistsToken(route.path, url);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this.checkIfExistsToken(route.routeConfig?.path, state.url);
  }

  checkIfExistsToken = (path: string | undefined, stateUrl?: string): Promise<boolean> => {
    let accessToken: string | null = localStorage.getItem('access_token');
    let refreshToken: string | null = localStorage.getItem('refresh_token');
    path = !path ? 'dashboard' : path;
    return new Promise(res => {
      if (AuthService.isTokenExpired(accessToken)) {
        this.appService.getAuthTokenFromRefreshToken$().subscribe(data => {
            accessToken = data.access_token;
            refreshToken = data.refresh_token;
            if (accessToken && refreshToken) {
              AuthService.setAccessToken$(accessToken);
              AuthService.setRefreshToken$(refreshToken);
              if (this.checkIfPathAssignedToRole(path, accessToken)) {
                return res(true);
              }
              stateUrl ? this.router.navigate(['/auth/login'], {queryParams: {returnUrl: stateUrl}}).then() :
                this.router.navigate(['auth/login']);
              return res(false);
            }
            AuthService.removeRefreshToken$();
            AuthService.removeAccessToken$();
            stateUrl ? this.router.navigate(['/auth/login'], {queryParams: {returnUrl: stateUrl}}).then() :
              this.router.navigate(['auth/login']);
            return res(false);
          },
          error => {
            stateUrl ? this.router.navigate(['/auth/login'], {queryParams: {returnUrl: stateUrl}}).then() :
              this.router.navigate(['auth/login']);
            return res(false);
          }
        );
      } else {
        return res(this.checkIfPathAssignedToRole(path, accessToken));
      }
    });

  }

  checkIfPathAssignedToRole(path?: string, accessToken?: string | null): boolean {
    if (path && accessToken) {
      let roles = sideNavItems[path]?.roles;
      if (roles) {
        const user: any = jwtDecode(accessToken);
        roles = roles?.filter((role: string) => {
          return (user.authorities.indexOf(this.userService.role$(role))) !== -1;
        });
        if (roles?.length) {
          // new UserService().user = jwtDecode(accessToken);
          return true;
        }
      }
      return false;
    }
    return false;
  }
}
