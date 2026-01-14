import { ChangeDetectionStrategy, Component, computed, input, model, signal, ViewEncapsulation } from '@angular/core';
import {
  NgpSelect,
  NgpSelectDropdown,
  NgpSelectOption,
  NgpSelectPortal,
} from 'ng-primitives/select';
import { FormFieldComponent } from "../form/form-field/form-field.component";
import { FormFieldControlBase } from '../form/form-field/form-field-control.component';

@Component({
  selector: 'ui-select',
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NgpSelect, NgpSelectDropdown, NgpSelectOption, NgpSelectPortal, FormFieldComponent],
})
export class SelectComponent extends FormFieldControlBase<string> {
  /** The options for the select. */
  readonly options = input.required<{ id: string; name: string; }[]>();
  
  protected readonly open = signal<boolean>(false);
  protected readonly valueLabel = computed(() => {
    const id = this.value();
    const option = this.options().find(o => o.id === id);
    return option?.name;
  });
}
