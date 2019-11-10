import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginModel } from "../models/LoginModel";
import { FormContext } from "../../FormContext";

export class SignInForm extends FormContext<LoginModel> {

  constructor(
    public form: FormGroup,
    public login: LoginModel
  ) {
    super(form, login);
  }

  public get password(): AbstractControl {
    return this.getControl('password');
  }

  public get email(): AbstractControl {
    return this.getControl('email');
  }

  public get rememberMe(): AbstractControl {
    return this.getControl('rememberMe');
  }

  public get userName(): AbstractControl {
    return this.getControl('userName');
  }

  public get returnUrl(): AbstractControl {
    return this.getControl('returnUrl');
  }

  public static createForm(model: LoginModel)
    : SignInForm {
    const form = new FormGroup({
      password: new FormControl(model.password, [Validators.required, Validators.maxLength(255)]),
      email: new FormControl(model.email, [Validators.required, Validators.maxLength(255)]),
      userName: new FormControl(model.userName, [Validators.required, Validators.maxLength(255)]),
      returnUrl: new FormControl(model.returnUrl),
      rememberMe: new FormControl(model.rememberMe)
    }, {updateOn: 'blur'});

    return new SignInForm(form, model);
  }

  public getFormData(): LoginModel {
    this.form.enable();
    return this.form.value
  }

}
