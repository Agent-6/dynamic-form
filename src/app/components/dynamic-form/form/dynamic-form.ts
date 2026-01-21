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
  Field,
  type FieldTree,
  form,
  readonly,
  required,
  type SchemaPath,
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
  imports: [Field, JsonPipe, SelectComponent, TextComponent, NumberComponent],
})
export class DynamicFormComponent {
  readonly controls = input.required<IFormControl[]>();

  readonly validatorsMap = computed(() => {
    console.log('updated');
    const map: { [key: IFormControl['name']]: IFormControl['validators'] } = {};
    for (const control of this.controls()) {
      map[control.name] = control.validators;
    }

    return map;
  });

  readonly controlSchema = schema<IFormControl['value']>(
    (control: SchemaPath<IFormControl['value']>) => {
      required(control, {
        when: ({ fieldTree }) => {
          const key = fieldTree().keyInParent().toString();
          const validators = this.validatorsMap()[key];

          console.log('required', { key: key, control: validators?.required });
          return !!validators?.required;
        },
      });

      disabled(control, ({ fieldTree }) => {
        const key = fieldTree().keyInParent().toString();
        const validators = this.validatorsMap()[key];

        console.log('disabled', { key: key, control: validators?.disabled });
        return validators?.disabled ? 'field is disabled' : false;
      });

      readonly(control, ({ fieldTree }) => {
        const key = fieldTree().keyInParent().toString();
        const validators = this.validatorsMap()[key];

        console.log('disabled', { key: key, control: validators?.disabled });
        return !!validators?.readonly;
      });
    },
  );

  readonly formControls = linkedSignal<{ [key: string]: IFormControl['value'] }>(() => {
    const controls: { [key: IFormControl['name']]: IFormControl['value'] } = {};
    for (const control of this.controls()) {
      controls[control.name] = control.value;
    }

    return controls;
  });

  readonly form = form(this.formControls, (schema) => {
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
