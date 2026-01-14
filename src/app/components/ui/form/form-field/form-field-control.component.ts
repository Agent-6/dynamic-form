// import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";

// @Component({
//   selector: 'ui-form-field-control',
//   template: `
//     <ng-content />
//   `,
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   encapsulation: ViewEncapsulation.None,
// })
// export class FormFieldControlComponent {}

import { Directive, input, model } from '@angular/core';
import { DisabledReason, FormValueControl, ValidationError, WithOptionalField } from '@angular/forms/signals';

@Directive({
  standalone: true,
})
export abstract class FormFieldControlBase<T> implements FormValueControl<T | undefined> {
  readonly label = input.required<string>();
  readonly description = input<string>();
  readonly placeholder = input<string>();

  readonly value = model<T>();
  readonly touched = model<boolean>(false);

  readonly name = input<string>('');
  readonly readonly = input<boolean>(false);
  readonly required = input<boolean>(false);
  readonly hidden = input<boolean>(false);

  readonly disabled = input<boolean>(false);
  readonly disabledReasons = input<readonly WithOptionalField<DisabledReason>[]>([]);

  readonly invalid = input<boolean>(false);
  readonly errors = input<readonly  WithOptionalField<ValidationError>[]>([]);
}
