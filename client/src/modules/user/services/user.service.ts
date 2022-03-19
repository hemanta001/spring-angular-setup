import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '@modules/auth/models';
import {Observable} from 'rxjs';
import {ResponseModel} from '@common/models';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) {
  }

  post$ = (userModel: User): Observable<ResponseModel<User>> => this.httpClient.post<ResponseModel<User>>(`${environment.baseUrl}users`, userModel);
  getAll$ = (roleName?: string): Observable<ResponseModel<User[]>> => {
    let url = `${environment.baseUrl}users`;
    if (roleName)
      url = `${url}?roleName=${roleName}`;
    return this.httpClient.get<ResponseModel<User[]>>(url);
  };
  getById$ = (id: string): Observable<ResponseModel<User>> => this.httpClient.get<ResponseModel<User>>(`${environment.baseUrl}users/${id}`);
  put$ = (id: string, userModel: User): Observable<ResponseModel<User>> => this.httpClient.put<ResponseModel<User>>(`${environment.baseUrl}users/${id}`, userModel);
  delete$ = (id: number): Observable<any> => this.httpClient.delete<any>(`${environment.baseUrl}users/${id}`);

}
