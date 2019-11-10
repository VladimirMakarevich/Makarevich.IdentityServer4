import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginModel } from "../models/LoginModel";
import { HttpApiService } from "../../../http-api.service";

@Injectable({
  providedIn: 'root'
})
export class AccountService extends HttpApiService {

  public constructor(
    protected http: HttpClient,
  ) {
    super(http);
  }

  public login = (loginModel: LoginModel): Observable<any> => {
    return this.post<LoginModel, any>(
      'account/login', loginModel);
  };

}
