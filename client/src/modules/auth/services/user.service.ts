import {Injectable} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';

import {User} from '../models';
import {UserRole} from '@modules/auth/models/UserRole';
import {ResponseModel} from '@common/models';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

const userSubject: ReplaySubject<User> = new ReplaySubject(1);

@Injectable()
export class UserService {
  constructor(private httpClient: HttpClient) {
    this.user = {
      id: '123',
      firstName: 'Online',
      lastName: 'Auction',
      email: 'auction@dev.com',
      // roles: [UserRole.USER],
      roles: [UserRole.ADMIN],
      username: 'auction'
    };
  }

  set user(user: User) {
    userSubject.next(user);
  }
  get$ = (): Observable<User> => this.httpClient.get<User>(`${environment.baseUrl}profile`);

  get user$(): Observable<User> {
    return userSubject.asObservable();
  }

   role$ = (role: string): UserRole => {
    return UserRole[role as keyof typeof UserRole];
  }
}
