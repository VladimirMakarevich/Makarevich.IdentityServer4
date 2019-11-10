import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  OnDestroy
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import {Subscription} from 'rxjs';
import { ControlDirective } from "../directives/control.directive";

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {provide: ControlDirective, useExisting: forwardRef(() => InputComponent), multi: true},
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputComponent), multi: true}
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent extends ControlDirective
  implements ControlValueAccessor, AfterViewInit, OnDestroy {


  public static BACKSPACE_KEY_CODE = 8;
  public static Z_KEY_CODE = 86;
  public static C_KEY_CODE = 67;

  private forbiddenSymbolsSubscription: Subscription;

  private _value: any = '';

  public onChange = (_) => {};

  public onTouched = () => {};

  @Input() public type = 'text';
  @Input() public maxLength = 255;
  @Input() public short: boolean;
  @Input() public placeholder: string;
  @Input() public control: AbstractControl = new FormControl();
  @Input() public focusOnInit: boolean;
  @Input() public inputName = '';
  @Input() public trimOnBlur = true;

  public handleKeyDown = (event: KeyboardEvent): void => {
    const isCtrlZ = event.ctrlKey && event.keyCode === InputComponent.Z_KEY_CODE;
    const isCtrlC = event.ctrlKey && event.keyCode === InputComponent.C_KEY_CODE;
    if (isCtrlC || isCtrlZ) {
      return;
    }
  };

  public get value(): any {
    return this._value;
  };

  public set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this.onChange(v);
    }
  }

  public writeValue(value: any) {
    this._value = value;
    this.onChange(value);
  }

  public registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public ngAfterViewInit(): void {
    if (this.trimOnBlur) {
      this.handleBlur();
    }
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.forbiddenSymbolsSubscription) {
      this.forbiddenSymbolsSubscription.unsubscribe();
      this.forbiddenSymbolsSubscription = null;
    }
  }

}
