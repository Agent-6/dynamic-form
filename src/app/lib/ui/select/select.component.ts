import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import {
  NgpSelect,
  NgpSelectDropdown,
  NgpSelectOption,
  NgpSelectPortal,
} from 'ng-primitives/select';
import type { SelectControl, SelectControlOption } from '@dynamic-form/types/controls/select';
import { FormFieldComponent } from '../form/form-field/form-field.component';
import {
  FormFieldControl,
  FormFieldStateService,
} from '../form/form-field/form-field-control.component';

@Component({
  selector: 'ui-select',
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NgpSelect, NgpSelectDropdown, NgpSelectOption, NgpSelectPortal, FormFieldComponent],
  providers: [FormFieldStateService],
})
export class SelectComponent extends FormFieldControl<SelectControl['value']> {
  /** The options for the select. */
  readonly options = input.required<SelectControlOption[]>();
  readonly variant = input<SelectControl['variant']>('id');
  readonly multi = input<SelectControl['multi']>(false);

  protected readonly open = signal<boolean>(false);
  
  protected readonly selectedOptionsLabel = computed(() => {
    return this.selectedOptions()?.map((o) => o.name)?.join(' ,');
  });
  
  private readonly selectedOptions = computed(() => {
    const value = this.value();
    if (!value) return [];
    
    const variant = this.variant();
    if (variant === 'option') {
      return this.multi() ? value as SelectControlOption[] : [value as SelectControlOption];
    }

    const ids = this.multi() ? value as string[] : [value as string];
    return this.options().filter((o) => ids.includes(o.id));
  });
}
