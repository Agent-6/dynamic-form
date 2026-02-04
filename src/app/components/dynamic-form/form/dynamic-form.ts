import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  ViewEncapsulation,
} from '@angular/core';
import {
  applyEach,
  applyWhen,
  disabled,
  email,
  type FieldTree,
  FormField,
  form,
  type LogicFn,
  readonly,
  required,
  type SchemaPath,
  type SchemaPathTree,
  schema,
  submit,
  validate,
} from '@angular/forms/signals';
import { InputComponent } from '../../ui/input/input.component';
import { NumberComponent } from '../../ui/number/number.component';
import { SelectComponent } from '../../ui/select/select.component';
import { type IFormControl, isNumber, isSelect, isText } from '../dynamic-form.model';

type whenFn<T extends IFormControl> = (control: IFormControl, value: T['value']) => boolean;

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormField, JsonPipe, SelectComponent, InputComponent, NumberComponent],
})
export class DynamicFormComponent {
  readonly controls = input.required<IFormControl[]>();

  readonly validatorsMap = computed(() => {
    const map: { [key: IFormControl['name']]: IFormControl['validators'] } = {};
    for (const control of this.controls()) {
      map[control.name] = control.validators;
    }

    return map;
  });

  isText = isText;
  isNumber = isNumber;
  isSelect = isSelect;

  getValidator<T>(
    selector: (validators: IFormControl['validators']) => T,
  ): LogicFn<IFormControl['value'], T> {
    return ({ fieldTree }) => {
      const key = fieldTree().keyInParent() as string;
      const validators = this.validatorsMap()[key];

      return selector(validators);
    };
  }

  whenControl<T extends IFormControl>(when: whenFn<T>): LogicFn<IFormControl['value'], boolean> {
    return ({ fieldTree, value }) => {
      const controlName = fieldTree().keyInParent() as string;
      const control = this.controls().find((c) => c.name === controlName);
      if (!control) return false;
      return when(control, value());
    };
  }

  url(field: SchemaPathTree<string>, options?: { message: string }) {
    validate(field, ({ value }) => {
      try {
        new URL(value());
        return null;
      } catch {
        return { kind: 'url', message: options?.message || 'URL format is not correct' };
      }
    });
  }

  private readonly controlSchema = schema<IFormControl['value']>((controlValue) => {
    required(controlValue, {
      message: 'filed is required',
      when: this.getValidator((validators) => !!validators?.required),
    });

    disabled(
      controlValue,
      this.getValidator((validators) => (validators?.disabled ? 'field is disabled' : false)),
    );

    readonly(
      controlValue,
      this.getValidator((validators) => !!validators?.readonly),
    );

    applyWhen(
      controlValue,
      this.whenControl((control) => control.type === 'email'),
      (emailValue) =>
        email(emailValue as SchemaPath<string>, { message: 'Email format is not correct' }),
    );

    applyWhen(
      controlValue,
      this.whenControl((control, value) => control.type === 'url' && !!value),
      (urlValue) => this.url(urlValue as SchemaPath<string>),
    );
  });

  readonly formState = linkedSignal<{ [key: string]: IFormControl['value'] }>(() => {
    const controls: { [key: IFormControl['name']]: IFormControl['value'] } = {};
    for (const control of this.controls()) {
      controls[control.name] = control.value;
    }

    return controls;
  });

  readonly form = form(this.formState, (schema) => {
    applyEach(schema, this.controlSchema);
  });

  getField<T extends IFormControl, TReturn extends T['value']>(
    control: T,
  ): FieldTree<TReturn, string> {
    return this.form[control.name] as FieldTree<TReturn, string>;
  }

  submit() {
    submit(this.form, async (form) => {
      const result = form().valid();
      const value = form().value();
      console.log('submitting form with validity:', result);
      console.log('form value:', value);

      return undefined;
    });
  }
}
