import {
  Component,
  Injectable,
  inject,
  input,
  model,
  type OnInit,
  type Signal,
  signal,
} from '@angular/core';
import type {
  DisabledReason,
  FormValueControl,
  ValidationError,
  WithOptionalField,
} from '@angular/forms/signals';

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
  errors: Signal<readonly WithOptionalField<ValidationError>[]>;
}

@Injectable()
export class FormFieldStateService<T> {
  private readonly _state = signal<FormFieldState<T> | undefined>(undefined);
  public readonly state = this._state.asReadonly();

  init(state: FormFieldState<T>): void {
    this._state.set(state);
  }
}

@Component({
  template: '',
})
export class FormFieldControl<T> implements OnInit, FormValueControl<T | undefined> {
  protected readonly stateService = inject(FormFieldStateService<T>);

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
  readonly errors = input<readonly WithOptionalField<ValidationError>[]>([]);

  ngOnInit(): void {
    this.stateService.init(this);
  }
}
