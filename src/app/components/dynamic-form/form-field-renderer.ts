import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import { FormField, type FieldTree } from '@angular/forms/signals';
import { InputComponent } from '../ui/input/input.component';
import { NumberComponent } from '../ui/number/number.component';
import { SelectComponent } from '../ui/select/select.component';
import { ColorPickerComponent } from '../ui/color-picker/color-picker.component';
import {
  isNumber,
  isSelect,
  isText,
  isColor,
  type IFormControl,
} from './dynamic-form.model';

@Component({
  selector: 'app-form-field-renderer',
  standalone: true,
  imports: [InputComponent, NumberComponent, SelectComponent, ColorPickerComponent, FormField],
  template: `
    @let c = control();
    @let f = field();

    @if (isText(c)) {
      <ui-input
        [label]="c.label || ''"
        [placeholder]="c.placeholder"
        [formField]="$any(f)"
        [type]="c.type"
      />
    } @else if (isNumber(c)) {
      <ui-number
        [label]="c.label || ''"
        [placeholder]="c.placeholder"
        [formField]="$any(f)"
      />
    } @else if (isSelect(c)) {
      <ui-select
        [label]="c.label || ''"
        [placeholder]="c.placeholder"
        [formField]="$any(f)"
        [options]="c.options"
      />
    } @else if (isColor(c)) {
      <ui-color-picker
        [label]="c.label || ''"
        [formField]="$any(f)"
      />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FormFieldRendererComponent {
  control = input.required<IFormControl>();
  field = input.required<FieldTree<any, any>>();

  protected readonly isText = isText;
  protected readonly isNumber = isNumber;
  protected readonly isSelect = isSelect;
  protected readonly isColor = isColor;
}
