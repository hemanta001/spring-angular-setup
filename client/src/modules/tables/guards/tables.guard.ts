import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment
} from '@angular/router';
import { Observable, of } from 'rxjs';
import {sideNavItems} from '@modules/navigation/data';
import {User} from '@modules/auth/models';
import jwtDecode from 'jwt-decode';
import {UserService} from '@modules/auth/services';

@Injectable()
export class TablesGuard implements CanActivate, CanLoad {
constructor(private router: Router,
            private userService: UserService) {
}
  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
    if (this.checkIfExistsToken(route.path)) {
      return of(true);
    }
    this.router.navigate(['auth/login']);
    return of(false);
  }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
      if (this.checkIfExistsToken(route.routeConfig?.path)) {
        return of(true);
      }
      this.router.navigate(['404']);
      return of(false);
    }

  checkIfExistsToken = (path: string | undefined): boolean => {
    const token: string | null = localStorage.getItem('token');
    path = !path ? 'dashboard' : path;
    if (token && path) {
      let roles = sideNavItems[path]?.roles;
      const user: User = jwtDecode(token);
      roles = roles?.filter((role: string) => {
        return (user.roles.indexOf(this.userService.role$(role))) !== -1;
      });
      if (roles?.length) {
        // new UserService().user = jwtDecode(token);
        return true;
      }
    }
    return false;
  }
}
