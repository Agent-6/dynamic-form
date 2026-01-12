import { ChangeDetectionStrategy, Component, contentChild, InjectionToken, input, ViewEncapsulation } from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { NgpFormField } from 'ng-primitives/form-field';

export const FORM_CONTROL_TOKEN = new InjectionToken<FormValueControl<any>>('FormValueControl');

@Component({
  selector: 'ui-form-field',
  template: `
    <div ngpFormField class="w-full flex flex-col gap-1">
      <!-- Label -->
      <label ngpLabel class="text-sm font-medium text-gray-700 dark:text-gray-200">
        {{ label() }}
        @if (field().required?.()) {
          <span class="ml-1 font-medium">&nbsp;*</span>
        }
      </label>
    
      <!-- Description -->
      @if (description()) {
        <p ngpDescription class="mb-1 text-xs text-gray-600 dark:text-gray-100" >
          {{ description() }}
        </p>
      }

      <!-- the field control, has to implement 'FormValueControl' -->
      <ng-content />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NgpFormField]
})
export class FormFieldComponent {
  field = contentChild.required(FORM_CONTROL_TOKEN);
  label = input.required<string>();
  description = input<string>();
}
