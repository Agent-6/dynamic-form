import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import { FormFieldComponent } from '../form/form-field/form-field.component';
import {
  FormFieldControl,
  FormFieldStateService,
} from '../form/form-field/form-field-control.component';

@Component({
  selector: 'ui-textarea',
  templateUrl: './textarea.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormFieldComponent],
  providers: [FormFieldStateService],
})
export class TextareaComponent extends FormFieldControl<string> {
  public readonly rows = input<number>(3);
}
