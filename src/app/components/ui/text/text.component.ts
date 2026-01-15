import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormFieldComponent } from "../form/form-field/form-field.component";
import { FormFieldControl, FormFieldStateService } from '../form/form-field/form-field-control.component';

@Component({
  selector: 'ui-text',
  templateUrl: './text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormFieldComponent],
  providers: [FormFieldStateService],
})
export class TextComponent extends FormFieldControl<string> {}
