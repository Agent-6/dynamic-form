// import { ChangeDetectionStrategy, Component, computed, contentChild, Directive, InjectionToken, input, InputSignal, InputSignalWithTransform, model, ModelSignal, OutputRef, Provider, ViewEncapsulation } from '@angular/core';
// import { DisabledReason, FormValueControl, ValidationError, WithOptionalField } from '@angular/forms/signals';
// import { NgpFormField } from 'ng-primitives/form-field';

// @Component({
//   selector: 'ui-form-field',
//   template: `
//     @if (!hidden()) {
//       <div ngpFormField class="w-full flex flex-col gap-1">
//         <!-- Label -->
//         <label ngpLabel [for]="name()" class="text-sm font-medium text-gray-700 dark:text-gray-200">
//           {{ label() }}
//           @if (required()) {
//             <span class="font-medium">*</span>
//           }
//         </label>
  
//         <!-- Description -->
//         @if (description()) {
//           <p ngpDescription class="mb-1 text-xs text-gray-600 dark:text-gray-100" >
//             {{ description() }}
//           </p>
//         }
  
//         <!-- Field Control -->
//         <ng-content />

//         <!-- Errors -->
//         @if (invalid()) {
//           @for (error of errors(); track $index) {
//             <span class="text-sm text-red-500">{{ error.message }}</span>
//           }
//         }
//       </div>
//     }
//   `,
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   encapsulation: ViewEncapsulation.None,
//   imports: [NgpFormField]
// })
// export class FormFieldComponent {
//   protected readonly control = contentChild.required(FormFieldControlComponent);
  
//   protected readonly label = computed(() => this.control().label());
//   protected readonly description = computed(() => this.control().description());
  
//   protected readonly name = computed(() => this.control().name());
//   protected readonly readonly = computed(() => this.control().readonly());
//   protected readonly required = computed(() => this.control().required());
//   protected readonly hidden = computed(() => this.control().hidden());

//   protected readonly invalid = computed(() => this.control().invalid());
//   protected readonly errors = computed(() => this.control().errors());
// }

// @Component({
//   template: '',
// })
// export abstract class FormFieldControlComponent<T = any> implements FormValueControl<T> {
//   readonly label = input.required<string>();
//   readonly description = input<string>();
//   readonly placeholder = input<string>();

//   readonly value = model.required<T>();
//   readonly touched = model<boolean>(false);

//   readonly name = input.required<string>();
//   readonly readonly = input<boolean>(false);
//   readonly required = input<boolean>(false);
//   readonly hidden = input<boolean>(false);

//   readonly disabled = input<boolean>(false);
//   readonly disabledReasons = input<readonly WithOptionalField<DisabledReason>[]>([]);

//   readonly invalid = input<boolean>(false);
//   readonly errors = input<readonly  WithOptionalField<ValidationError>[]>([]);
// }

import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  ViewEncapsulation,
} from '@angular/core';
import { NgpFormField } from 'ng-primitives/form-field';
import { FormFieldControlDirective } from './form-field-control.directive';

@Component({
  selector: 'ui-form-field',
  standalone: true,
  imports: [NgpFormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (!control().hidden()) {
      <div ngpFormField class="w-full flex flex-col gap-1">
        <!-- Label -->
        <label
          ngpLabel
          [for]="control().name()"
          class="text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {{ control().label() }}
          @if (control().required()) {
            <span class="font-medium">*</span>
          }
        </label>

        <!-- Description -->
        @if (control().description()) {
          <p
            ngpDescription
            class="mb-1 text-xs text-gray-600 dark:text-gray-100"
          >
            {{ control().description() }}
          </p>
        }

        <!-- Control -->
        <ng-content />

        <!-- Errors -->
        @if (control().invalid()) {
          @for (error of control().errors(); track $index) {
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
  protected readonly control = contentChild.required(FormFieldControlDirective);
}

