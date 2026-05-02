import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormFieldComponent } from '../form/form-field/form-field.component';
import {
  FormFieldControl,
  FormFieldStateService,
} from '../form/form-field/form-field-control.component';

@Component({
  selector: 'ui-color-picker',
  standalone: true,
  imports: [FormFieldComponent],
  template: `
    <ui-form-field>
      <input
        type="color"
        [id]="name()"
        [value]="value()"
        (input)="value.set($any($event.target).value)"
        (blur)="touched.set(true)"
        [disabled]="disabled()"
        [readonly]="readonly()"
        class="w-12 h-12 p-1 bg-white border border-gray-300 rounded-sm cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1"
        [class.opacity-50]="disabled()"
      />
    </ui-form-field>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [FormFieldStateService],
})
export class ColorPickerComponent extends FormFieldControl<string> {}
