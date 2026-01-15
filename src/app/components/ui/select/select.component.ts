import { ChangeDetectionStrategy, Component, computed, input, signal, ViewEncapsulation } from '@angular/core';
import {
  NgpSelect,
  NgpSelectDropdown,
  NgpSelectOption,
  NgpSelectPortal,
} from 'ng-primitives/select';
import { FormFieldComponent } from "../form/form-field/form-field.component";
import { FormFieldControl, FormFieldStateService } from '../form/form-field/form-field-control.component';

@Component({
  selector: 'ui-select',
  templateUrl: './select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NgpSelect, NgpSelectDropdown, NgpSelectOption, NgpSelectPortal, FormFieldComponent],
  providers: [FormFieldStateService],
})
export class SelectComponent extends FormFieldControl<string> {
  /** The options for the select. */
  readonly options = input.required<{ id: string; name: string; }[]>();
  
  protected readonly open = signal<boolean>(false);
  protected readonly selectedOptionLabel = computed(() => {
    const id = this.value();
    const option = this.options().find(o => o.id === id);
    return option?.name;
  });
}
