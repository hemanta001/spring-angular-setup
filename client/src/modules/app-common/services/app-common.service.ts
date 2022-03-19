import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {ResponseModel} from '@common/models';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {v4 as uuidv4} from 'uuid';
import {FileUrl} from '@modules/user/models/user.model';
@Injectable()
export class AppCommonService {
  constructor(private httpClient: HttpClient) {
  }

  getAppCommon$(): Observable<{}> {
    return of({});
  }

  post$ = (file: File | undefined): Observable<ResponseModel<FileUrl>>  => {
    if (file) {
      console.log(file.name);
      const formData = new FormData();
      formData.append('photo', file, `${uuidv4()}.${file.name.split('.')[1]}`);
      return this.httpClient.post<ResponseModel<{ fileUrl: string }>>(`${environment.baseUrl}photos/upload`, formData);
    }
    return of();
  }

}
