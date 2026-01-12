import { ChangeDetectionStrategy, Component, computed, input, InputSignal, InputSignalWithTransform, model, signal, ViewEncapsulation } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import {
  NgpSelect,
  NgpSelectDropdown,
  NgpSelectOption,
  NgpSelectPortal,
} from 'ng-primitives/select';
import { FormFieldComponent } from "../form/form-field/form-field.component";
import { FormFieldControlComponent } from "../form/form-field/form-field-control.component";
import { FormFieldLabelComponent } from '../form/form-field/form-filed-label.component';

@Component({
  selector: 'ui-select',
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NgpSelect, NgpSelectDropdown, NgpSelectOption, NgpSelectPortal, FormFieldComponent, FormFieldLabelComponent, FormFieldControlComponent],
})
export class SelectComponent implements FormValueControl<string | undefined> {
  /** The options for the select. */
  readonly options = input.required<{ id: string; name: string; }[]>();
  readonly label = input.required<string>();

  /** The selected value. */
  readonly value = model<string>();

  readonly required = input(true);

  protected readonly open = signal<boolean>(false);
  protected readonly valueLabel = computed(() => {
    const id = this.value();
    const option = this.options().find(o => o.id === id);
    return option?.name;
  })

  /** The placeholder for the input. */
  readonly placeholder = input<string>('');

  /** The disabled state of the select. */
  readonly disabled = input<boolean>(false);
}
