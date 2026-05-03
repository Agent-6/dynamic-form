import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import type { CheckboxVariant } from '@dynamic-form/types/controls/checkbox';
import type { SelectControlOption } from '@dynamic-form/types/controls/select';
import { FormFieldComponent } from '../form/form-field/form-field.component';
import {
  FormFieldControl,
  FormFieldStateService,
} from '../form/form-field/form-field-control.component';

@Component({
  selector: 'ui-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormFieldComponent],
  providers: [FormFieldStateService],
})
export class CheckboxGroupComponent extends FormFieldControl<string[]> {
  public readonly options = input.required<SelectControlOption[]>();
  public readonly variant = input<CheckboxVariant>('checkbox');

  protected onToggle(id: string) {
    this.value.update((current) => {
      const val = current || [];
      if (val.includes(id)) {
        return val.filter((i) => i !== id);
      } else {
        return [...val, id];
      }
    });
  }

  protected isSelected(id: string): boolean {
    return (this.value() || []).includes(id);
  }
}
