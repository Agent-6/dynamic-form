import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import { TextControlType } from '../../dynamic-form/dynamic-form.model';
import { FormFieldComponent } from '../form/form-field/form-field.component';
import {
  FormFieldControl,
  FormFieldStateService,
} from '../form/form-field/form-field-control.component';

@Component({
  selector: 'ui-input',
  templateUrl: './input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormFieldComponent],
  providers: [FormFieldStateService],
})
export class InputComponent extends FormFieldControl<string> {
  public readonly type = input.required<TextControlType>();
}
