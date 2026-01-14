import { Directive } from '@angular/core';
import { FormFieldControlBase } from './form-field-control.component';

@Directive({
  selector: '[uiFormFieldControl]',
  standalone: true,
})
export class FormFieldControlDirective<T> extends FormFieldControlBase<T> {}
