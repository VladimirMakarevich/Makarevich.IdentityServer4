import { Component, Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { User, UserManager } from 'oidc-client';

export class Constants {
  public static stsAuthority = 'http://localhost:5000';
  public static clientId = 'angularClient';
  public static clientRoot = 'http://localhost:4200';
  public static clientScope = 'openid profile';

  public static apiRoot = 'http://localhost:4200';
}

@Injectable({
  providedIn: 'root'
})
export class AppAuthNService {

  _userManager: UserManager;

  constructor() {
    var settings = {
      authority: Constants.stsAuthority,
      client_id: Constants.clientId,
      redirect_uri: `${Constants.clientRoot}/home`,
      automaticSilentRenew: true,
      silent_redirect_uri: `${Constants.clientRoot}/home`,
      post_logout_redirect_uri: `${Constants.clientRoot}`,
      response_type: 'code',
      // response_type: 'id_token token',
      scope: Constants.clientScope,
      loadUserInfo: true,
    };
    this._userManager = new UserManager(settings);
  }

  public getUser(): Promise<User> {
    debugger;
    return this._userManager.getUser();
  }

  public login(): Promise<void> {
    debugger;
    return this._userManager.signinRedirect();
  }

  public renewToken(): Promise<User> {
    debugger;
    return this._userManager.signinSilent();
  }

  public logout(): Promise<void> {
    debugger;
    return this._userManager.signoutRedirect();
  }
}


@Injectable({
  providedIn: 'root'
})
export class TestApiService {

  constructor(private _httpClient: HttpClient, private _authn: AppAuthNService) {
  }

  public callApi(): Promise<any> {
    return this._authn.getUser().then(user => {
      if (user && user.access_token) {
        return this._callApi(user.access_token);
      }
      else if (user) {
        return this._authn.renewToken().then(user => {
          return this._callApi(user.access_token);
        });
      }
      else {
        throw new Error("user is not logged in");
      }
    });
  }

  _callApi(token: string) {
    let headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + token
    });

    return this._httpClient.get(Constants.apiRoot + "test", { headers: headers })
      .toPromise()
      .catch((result: HttpErrorResponse) => {
        if (result.status === 401) {
          return this._authn.renewToken().then(user => {
            return this._callApi(user.access_token);
          });
        }
        throw result;
      });
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public title = 'oidc-client';

  constructor(public authn: AppAuthNService, public apiService: TestApiService) {
  }

  messages: string[] = [];

  get currentUserJson(): string {
    return JSON.stringify(this.currentUser, null, 2);
  }

  currentUser: User;

  ngOnInit(): void {
    this.authn.getUser().then(user => {
      debugger;
      this.currentUser = user;

      console.log(user);

      if (user) {
        this.addMessage("User Logged In");
      }
      else {
        this.addMessage("User Not Logged In");
      }
    }).catch(err => {
      console.log(err);
      this.addError(err);
    });
  }

  clearMessages() {
    while (this.messages.length) {
      this.messages.pop();
    }
  }

  addMessage(msg: string) {
    this.messages.push(msg);
  }

  addError(msg: string | any) {
    this.messages.push("Error: " + msg && msg.message);
  }

  public onLogin() {
    this.clearMessages();
    this.authn.login().catch(err => {
      debugger;
      console.log(err);
      this.addError(err);
    });
  }

  public onCallAPI() {
    this.clearMessages();
    this.apiService.callApi().then(result => {
      console.log(result);
      this.addMessage("API Result: " + JSON.stringify(result));
    }, err => {
      console.log(err);
      this.addError(err);
    });
  }

  public onRenewToken() {
    this.clearMessages();
    this.authn.renewToken()
      .then(user => {
        this.currentUser = user;
        this.addMessage("Silent Renew Success");
      })
      .catch(err => {
        console.log(err);
        this.addError(err);
      });
  }

  public onLogout() {
    this.clearMessages();
    this.authn.logout().catch(err => this.addError(err));
  }


  // public isAuthenticated: boolean;
  // public userData: any;

  // public constructor(
  // public oidcSecurityService: OidcSecurityService
  // ) {
  // this.initialize();
  // }

  // public ngOnInit(): void {
  //   debugger;
  //   this.oidcSecurityService.getIsAuthorized().subscribe(auth => {
  //     this.isAuthenticated = auth;
  //   });
  //
  //   this.oidcSecurityService.getUserData().subscribe(userData => {
  //     this.userData = userData;
  //   });
  // }
  //
  // public ngOnDestroy(): void {
  // }
  //
  // public login(): void {
  //   debugger;
  //   this.oidcSecurityService.authorize();
  // }
  //
  // public logout(): void {
  //   debugger;
  //   this.oidcSecurityService.logoff();
  // }
  //
  // private initialize(): void {
  //   debugger;
  //   if (this.oidcSecurityService.moduleSetup) {
  //     this.doCallbackLogicIfRequired();
  //   } else {
  //     this.oidcSecurityService.onModuleSetup.subscribe(() => {
  //       this.doCallbackLogicIfRequired();
  //     });
  //   }
  // }
  //
  // private doCallbackLogicIfRequired(): void {
  //   debugger;
  //   // Will do a callback, if the url has a code and state parameter.
  //   this.oidcSecurityService.authorizedCallbackWithCode(window.location.toString());
  // }
}
