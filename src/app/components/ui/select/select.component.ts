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
import type { SelectControl, SelectControlOption } from '../../dynamic-form/dynamic-form.model';
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

  protected readonly open = signal<boolean>(false);

  protected readonly selectedOptionLabel = computed(() => {
    switch (this.variant()) {
      case 'multi': {
        const values = this.value() as SelectControlOption[];
        return values?.map((v) => v.name)?.join(' ,');
      }
      case 'option': {
        const value = this.value() as SelectControlOption;
        return value?.name;
      }
      case 'id': {
        const id = this.value() as string;
        return this.options().find((o) => o.id === id)?.name;
      }
    }
  });

  getOptionValue(option: SelectControlOption) {
    switch (this.variant()) {
      case 'multi': {
        const values = this.value() as SelectControlOption[];
        const rest = values?.filter((v) => v.id !== option.id) || [];
        return [...rest, option];
      }
      case 'option':
        return option;
      case 'id':
        return option.id;
    }
  }
}
