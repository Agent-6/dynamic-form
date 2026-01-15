import { Component, inject, Injectable, input, model, OnInit, Signal } from '@angular/core';
import { DisabledReason, FormValueControl, ValidationError, WithOptionalField } from '@angular/forms/signals';

export interface FormFieldState<T> {
  label: Signal<string>;
  description: Signal<string | undefined>;
  placeholder: Signal<string | undefined>;

  value: Signal<T>;
  touched: Signal<boolean>;

  name: Signal<string>;
  readonly: Signal<boolean>;
  required: Signal<boolean>;
  hidden: Signal<boolean>;

  disabled: Signal<boolean>;
  disabledReasons: Signal<readonly WithOptionalField<DisabledReason>[]>;

  invalid: Signal<boolean>;
  errors: Signal<readonly  WithOptionalField<ValidationError>[]>;
}

@Injectable()
export class FormFieldStateService<T> {
  state!: FormFieldState<T>;
  label!: Signal<string>;
  description!: Signal<string | undefined>;
  placeholder!: Signal<string | undefined>;

  value!: Signal<T>;
  touched!: Signal<boolean>;

  name!: Signal<string>;
  readonly!: Signal<boolean>;
  required!: Signal<boolean>;
  hidden!: Signal<boolean>;

  disabled!: Signal<boolean>;
  disabledReasons!: Signal<readonly WithOptionalField<DisabledReason>[]>;

  invalid!: Signal<boolean>;
  errors!: Signal<readonly  WithOptionalField<ValidationError>[]>;

  init(state: FormFieldState<T>): void {
    this.label = state.label;
    this.description = state.description;
    this.placeholder = state.placeholder;

    this.value = state.value;
    this.touched = state.touched;

    this.name = state.name;
    this.readonly = state.readonly;
    this.required = state.required;
    this.hidden = state.hidden;

    this.disabled = state.disabled;
    this.disabledReasons = state.disabledReasons;

    this.invalid = state.invalid;
    this.errors = state.errors;
  }
}

@Component({
  template: '',
})
export class FormFieldControl<T> implements OnInit, FormValueControl<T | undefined> {
  protected readonly state = inject(FormFieldStateService<T>);

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

  ngOnInit(): void {
    this.state.init(this);
  }
}