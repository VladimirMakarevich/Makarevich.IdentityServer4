import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  AuthModule,
  ConfigResult,
  OidcConfigService,
  OidcSecurityService,
  OpenIdConfiguration
} from "angular-auth-oidc-client";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { UnauthorizedComponent } from "./components/unauthorized/unauthorized.component";
import { ForbiddenComponent } from "./components/forbidden/forbidden.component";
import { LoginComponent } from "./components/account/login/login.component";
import { InputComponent } from "./shared/input/input.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

// const oidc_configuration = 'assets/auth.clientConfiguration.json';
//
// export function loadConfig(oidcConfigService: OidcConfigService) {
//   return () => oidcConfigService.load(oidc_configuration);
// }


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UnauthorizedComponent,
    ForbiddenComponent,
    LoginComponent,
    InputComponent
  ],
  bootstrap: [
    AppComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    // RouterModule.forRoot([
    //   { path: '', component: AppComponent },
    //   { path: 'home', component: AppComponent },
    //   { path: 'forbidden', component: AppComponent },
    //   { path: 'unauthorized', component: AppComponent },
    // ]),
    // AuthModule.forRoot(),
  ],
  providers: [
    // OidcConfigService,
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: loadConfig,
    //   deps: [OidcConfigService],
    //   multi: true,
    // },
  ]
})
export class AppModule {
  // constructor(private oidcSecurityService: OidcSecurityService, private oidcConfigService: OidcConfigService) {
  //   this.oidcConfigService.onConfigurationLoaded.subscribe((configResult: ConfigResult) => {
  //     debugger;
  //
  //     // Use the configResult to set the configurations
  //
  //     const config: OpenIdConfiguration = {
  //       stsServer: configResult.customConfig.stsServer,
  //       redirect_url: 'https://localhost:5001',
  //       client_id: 'angularClient',
  //       scope: 'openid profile',
  //       response_type: 'code',
  //       silent_renew: true,
  //       silent_renew_url: 'https://localhost:5001/',
  //       log_console_debug_active: true,
  //       // all other properties you want to set
  //     };
  //
  //     this.oidcSecurityService.setupModule(config, configResult.authWellknownEndpoints);
  //   });
  // }
}
