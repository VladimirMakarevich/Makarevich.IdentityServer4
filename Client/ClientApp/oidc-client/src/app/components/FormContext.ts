import { each } from 'lodash';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

export enum ErrorCodeEnum {

  serverError = 'serverError',

  required = 'required',

  email = 'email',

  maxLength = 'maxlength',

  minLength = 'minlength',

  min = 'min',

  max = 'max'

}


export abstract class FormContext<T> {

  public static SERVER_ERROR_KEY = ErrorCodeEnum.serverError;

  public validated: boolean;
  public formValidity = new Subject<boolean>();
  private isFormDisabled: boolean;

  public static touchAll(control: AbstractControl): void {
    control.markAsTouched({ onlySelf: false });
    if (control instanceof FormGroup) {
      each((control as FormGroup).controls, FormContext.touchAll);
    }
    if (control instanceof FormArray) {
      each((control as FormArray).controls, FormContext.touchAll);
    }
  }

  public update = (data?: any): void => (null);

  public setFormError = (error: any): void => {
    const control = this.getControl(error.key);
    if (control) {
      control.setErrors({ [FormContext.SERVER_ERROR_KEY]: error.message });
    }
  }

  protected constructor(
    public form: FormGroup,
    public data: T = null,
  ) {
  }

  public get touched() {
    return this.form.touched;
  }

  public get invalid() {
    return this.form.invalid;
  }

  public get isDisabled() {
    return this.isFormDisabled;
  }

  public get valueChanges(): Observable<T> {
    return this.form.valueChanges;
  }

  public isValid(): boolean {
    return this.form.valid;
  }

  public abstract getFormData(): T;

  public validate(): boolean {
    this.validated = true;
    FormContext.touchAll(this.form);
    this.formValidity.next(this.form.valid);

    return this.form.valid;
  }

  public resetForm(data?: T, options?: object): void {
    this.validated = false;
    if (data) {
      this.data = data;
    }

    this.form.reset(this.data || {}, options);
  }

  public patchForm(data: Partial<T>): void {
    this.form.patchValue(data);
  }

  public getFieldValue(key: string): any {
    const control = this.getControl(key);
    return control ? control.value : null;
  }

  public resetControl(key: string, value?: any) {
    const control = this.getControl(key);
    if (control) {
      control.reset(value);
    }
  }

  public getControl(key: string): AbstractControl | null {
    return this.form.get(key);
  }

  public disableForm(options?: object): void {
    this.form.disable(options);
    this.isFormDisabled = true;
  }

  public enableForm(options?: object): void {
    this.form.enable(options);
    this.isFormDisabled = false;
  }

  public setFormErrors(errors: Array<any>): void {
    each(errors, this.setFormError);
  }

}
