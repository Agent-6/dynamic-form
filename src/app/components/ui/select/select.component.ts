import { ChangeDetectionStrategy, Component, input, model, ViewEncapsulation } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import {
  NgpSelect,
  NgpSelectDropdown,
  NgpSelectOption,
  NgpSelectPortal,
} from 'ng-primitives/select';

@Component({
  selector: 'ui-select',
  imports: [NgpSelect, NgpSelectDropdown, NgpSelectOption, NgpSelectPortal],
  templateUrl: './select.component.html',
  styleUrl: './select.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class SelectComponent implements FormValueControl<string | undefined> {
  /** The options for the select. */
  readonly options = input.required<{ id: string; name: string; }[]>();
  readonly label = input<string>();

  /** The selected value. */
  readonly value = model<string>();

  /** The placeholder for the input. */
  readonly placeholder = input<string>('');

  /** The disabled state of the select. */
  readonly disabled = input<boolean>(false);
}
