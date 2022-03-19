import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import jwtDecode from 'jwt-decode';

@Injectable()
export class AuthService {
  url = environment.baseUrl;

  constructor(private httpClient: HttpClient) {
  }

  static isTokenExpired(token?: string | null): boolean {
    if (!token) {
      return true;
    }

    const date = this.getTokenExpirationDate(token);
    if (!date) {
      return false;
    }
    return !(date.valueOf() > new Date().valueOf());
  }

  static getTokenExpirationDate(token: string): Date | null {
    const decoded: any = jwtDecode(token);

    if (decoded.exp === undefined) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  static setAccessToken$ = (token: string) => {
    localStorage.setItem('access_token', token);
  }
  static setRefreshToken$ = (token: string) => {
    localStorage.setItem('refresh_token', token);
  }
  static getAccessToken$ = () => {
    return localStorage.getItem('access_token');
  }
  static getRefreshToken$ = () => {
    return localStorage.getItem('refresh_token');
  }

  static removeRefreshToken$ = () => {
    localStorage.removeItem('refresh_token');
  }
  static removeAccessToken$ = () => {
    localStorage.removeItem('access_token');
  }

  getAuth$(): Observable<{}> {
    return of({});
  }

  register(userData: any) {
    return this.httpClient.post(`${this.url}signup`, userData);
  }

  login(loginData: { username: string, password: string }) {
    return this.loadAccessToken$(true, undefined, loginData.username, loginData.password)
  }


  loadAccessToken$ = (retrieveAccessToken: boolean, refreshToken?: string | undefined, username?: string, password?: string):
    Observable<string> => {
    console.log(retrieveAccessToken ? 'login' : 'refresh_token');
    const params = retrieveAccessToken ?
      new HttpParams()
        .set('username', `${username}`)
        .set('password', `${password}`)
        .set('grant_type', 'password') :
      new HttpParams()
        .set('refreshTokenKey', 'refreshToken')
        .set('grant_type', 'refreshTokenKey');
    return this.httpClient.post<any>(`${environment.oauthUrl}`, params,
      {
        headers: new HttpHeaders().append('Authorization',
          'Basic ' + btoa(`${environment.clientId}:${environment.clientSecret}`)),
      }
    )
  }

  logout() {
    return this.httpClient.delete(`${environment.baseUrl}oauth/token`);
  }
}
