import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { InputComponent } from '../ui/input/input.component';
import { NumberComponent } from '../ui/number/number.component';
import { SelectComponent } from '../ui/select/select.component';
import { ColorPickerComponent } from '../ui/color-picker/color-picker.component';
import {
  type DiscriminatedField,
  isType,
  TEXT_CONTROL_TYPES,
} from './dynamic-form.model';

@Component({
  selector: 'app-form-field-renderer',
  standalone: true,
  imports: [InputComponent, NumberComponent, SelectComponent, ColorPickerComponent, FormField],
  template: `
    @let d = data();

    @if (isType(d, ...textTypes)) {
      <ui-input
        [label]="d.control.label || ''"
        [placeholder]="d.control.placeholder"
        [formField]="d.field"
        [type]="d.control.type"
      />
    } @else if (isType(d, 'number')) {
      <ui-number
        [label]="d.control.label || ''"
        [placeholder]="d.control.placeholder"
        [formField]="d.field"
      />
    } @else if (isType(d, 'select')) {
      <ui-select
        [label]="d.control.label || ''"
        [placeholder]="d.control.placeholder"
        [formField]="d.field"
        [options]="d.control.options"
        [variant]="d.control.variant"
        [multi]="d.control.multi"
      />
    } @else if (isType(d, 'color')) {
      <ui-color-picker
        [label]="d.control.label || ''"
        [formField]="d.field"
      />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FormFieldRendererComponent {
  data = input.required<DiscriminatedField>();

  protected isType = isType;
  protected textTypes = TEXT_CONTROL_TYPES;
}
