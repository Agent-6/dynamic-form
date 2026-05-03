import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import type { SelectControlOption } from '@dynamic-form/types/controls/select';
import { FormFieldComponent } from '../form/form-field/form-field.component';
import {
  FormFieldControl,
  FormFieldStateService,
} from '../form/form-field/form-field-control.component';

@Component({
  selector: 'ui-radio',
  templateUrl: './radio.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormFieldComponent],
  providers: [FormFieldStateService],
})
export class RadioComponent extends FormFieldControl<string> {
  public readonly options = input.required<SelectControlOption[]>();

  protected onSelect(id: string) {
    this.value.set(id);
  }
}
