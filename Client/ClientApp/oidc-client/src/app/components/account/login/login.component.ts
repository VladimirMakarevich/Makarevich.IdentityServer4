import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SignInForm } from "./SignInForm";
import { SignInSandbox } from "./SignInSandbox";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [SignInSandbox]
})
export class LoginComponent implements OnInit, OnDestroy {
  public errorMessage: string;
  public signInForm: SignInForm;

  public constructor(
    public sandbox: SignInSandbox,
    public router: Router
  ) {
  }

  public ngOnInit(): void {
    this.signInForm = this.sandbox.createForm();
  }

  public ngOnDestroy(): void {
    this.sandbox.dispose();
  }

  public handleSignIn(event: Event): void {
    event.stopPropagation();
    if (!this.signInForm.validate) {
      return;
    }

    this.sandbox.handleSignIn(this.signInForm);
  }

  public handleSignUp(): void {
    this.router.navigate(['/', 'home']);
  }

  public handleGoBack(): void {
    this.router.navigate(['/', 'home']);
  }

  public get isValidSignInForm(): boolean {
    return this.signInForm.validate();
  }
}
