import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import type { CheckboxVariant } from '@dynamic-form/types/controls/checkbox';
import { FormFieldComponent } from '../form/form-field/form-field.component';
import {
  FormFieldControl,
  FormFieldStateService,
} from '../form/form-field/form-field-control.component';

@Component({
  selector: 'ui-checkbox',
  templateUrl: './checkbox.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormFieldComponent],
  providers: [FormFieldStateService],
})
export class CheckboxComponent extends FormFieldControl<boolean> {
  public readonly variant = input<CheckboxVariant>('checkbox');

  protected onToggle() {
    this.value.update((v) => !v);
  }
}
