import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { NgpFormField } from 'ng-primitives/form-field';
import { FormFieldStateService } from './form-field-control.component';

@Component({
  selector: 'ui-form-field',
  standalone: true,
  imports: [NgpFormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (!state.hidden()) {
      <div ngpFormField class="w-full flex flex-col gap-1">
        <!-- Label -->
        <label
          ngpLabel
          [for]="state.name()"
          class="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {{ state.label() }}
          @if (state.required()) {
            <span class="font-medium">*</span>
          }
        </label>

        <!-- Description -->
        @if (state.description()) {
          <p
            ngpDescription
            class="mb-1 text-xs text-gray-600 dark:text-gray-100"
          >
            {{ state.description() }}
          </p>
        }

        <!-- Control -->
        <ng-content />

        <!-- Errors -->
        @if (state.invalid()) {
          @for (error of state.errors(); track $index) {
            <span class="text-sm text-red-500">
              {{ error.message }}
            </span>
          }
        }
      </div>
    }
  `,
})
export class FormFieldComponent {
  protected readonly state = inject(FormFieldStateService);
}
