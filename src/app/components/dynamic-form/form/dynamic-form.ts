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
  disabled,
  type FieldTree,
  FormField,
  form,
  type LogicFn,
  readonly,
  required,
  schema,
  submit,
} from '@angular/forms/signals';
import { NumberComponent } from '../../ui/number/number.component';
import { SelectComponent } from '../../ui/select/select.component';
import { TextComponent } from '../../ui/text/text.component';
import type { IFormControl } from '../dynamic-form.model';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormField, JsonPipe, SelectComponent, TextComponent, NumberComponent],
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

  getValidator<T>(
    selector: (validators: IFormControl['validators']) => T,
  ): LogicFn<IFormControl['value'], T> {
    return ({ fieldTree }) => {
      const key = fieldTree().keyInParent() as string;
      const validators = this.validatorsMap()[key];

      return selector(validators);
    };
  }

  private readonly controlSchema = schema<IFormControl['value']>((control) => {
    required(control, {
      message: 'filed is required',
      when: this.getValidator((validators) => !!validators?.required),
    });

    disabled(
      control,
      this.getValidator((validators) => (validators?.disabled ? 'field is disabled' : false)),
    );
    readonly(
      control,
      this.getValidator((validators) => !!validators?.readonly),
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
