import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { InputComponent } from '@ui/input/input.component';
import { NumberComponent } from '@ui/number/number.component';
import { SelectComponent } from '@ui/select/select.component';
import { ColorPickerComponent } from '@ui/color-picker/color-picker.component';
import { DateComponent } from '@ui/date/date.component';
import { DiscriminatedField, isType } from '@dynamic-form/types/utils';

@Component({
  selector: 'app-dynamic-field',
  templateUrl: 'dynamic-field.html',
  standalone: true,
  imports: [InputComponent, NumberComponent, SelectComponent, ColorPickerComponent, DateComponent, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DynamicFieldComponent {
  data = input.required<DiscriminatedField>();

  protected isType = isType;
  protected textTypes = ['text', 'email', 'password', 'url'] as const;
}
