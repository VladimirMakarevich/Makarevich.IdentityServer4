import { trim } from 'lodash';
import { Directive, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { fromEvent, Subscription } from 'rxjs';

@Directive({
  selector: '[appControl]'
})
export class ControlDirective implements OnInit, OnDestroy {

  @Input()
  public placeholder: string;

  @Input()
  public control: AbstractControl = new FormControl();

  @Input()
  public focusOnInit: boolean;

  @Input()
  public name = '';

  @ViewChild('input')
  public inputElement: HTMLInputElement;

  public get error(): string {
    return 'error ups!';
  }

  protected blurEventSubscription: Subscription;

  public ngOnInit(): void {
    if (this.focusOnInit) {
    }
  }

  public ngOnDestroy(): void {
    if (this.blurEventSubscription) {
      this.blurEventSubscription.unsubscribe();
      this.blurEventSubscription = null;
    }
  }

  protected handleBlur(): void {
    if (this.inputElement) {
      this.blurEventSubscription = fromEvent(this.inputElement, 'blur')
        .subscribe(this.trimControlValue);
    }
  }

  protected trimControlValue = (event: Event): void => {
    this.control.patchValue(trim(this.control.value), { onlySelf: true, emitEvent: false });
  }

}
