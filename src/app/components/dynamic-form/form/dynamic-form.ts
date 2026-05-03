import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  input,
  linkedSignal,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import {
  applyEach,
  disabled,
  type FieldTree,
  form,
  type LogicFn,
  readonly,
  required,
  schema,
  submit,
} from '@angular/forms/signals';
import { DynamicFieldComponent } from '../field/dynamic-field';
import { DiscriminatedField, FormControl } from '../../../lib/dynamic-form/types/utils';
import { applyTypeValidators, getControlFormContext } from '../../../lib/dynamic-form/types/validation';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [JsonPipe, DynamicFieldComponent],
})
export class DynamicFormComponent<TControl extends FormControl = FormControl> {
  readonly controls = input.required<TControl[]>();
  readonly fieldTemplate = contentChild<TemplateRef<{ $implicit: TControl; field: FieldTree<any, any> }>>('fieldTemplate');

  readonly validatorsMap = computed(() => {
    const map: { [key: string]: any } = {};
    for (const control of this.controls()) {
      map[control.key] = control.validators;
    }

    return map;
  });

  getValidator<T>(
    selector: (validators: any) => T,
  ): LogicFn<any, T> {
    return ({ fieldTree }) => {
      const key = fieldTree().keyInParent() as string;
      const validators = this.validatorsMap()[key];

      return selector(validators);
    };
  }

  getControl: getControlFormContext = ({ fieldTree }) => {
    const key = fieldTree().keyInParent() as string;
    const control = (this.controls() as FormControl[]).find((c) => c.key === key);
    return control;
  };

  private readonly controlSchema = schema<FormControl['value']>((controlValue) => {
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

    applyTypeValidators(controlValue, this.getControl);
  });

  readonly formState = linkedSignal<TControl[], Record<string, FormControl['value']>>({
    source: this.controls,
    computation: (controls, previous) => {
      const state: Record<string, FormControl['value']> = {};
      for (const control of controls) {
        state[control.key] = previous?.value?.[control.key] ?? control.value;
      }

      return state;
    }
  });

  readonly form = form(this.formState, (schema) => {
    applyEach(schema, this.controlSchema);
  });

  getFieldData<
    TControl extends FormControl,
    TReturn extends TControl['value']
  >(
    control: TControl
  ): DiscriminatedField {
    return { control, field: this.form[control.key] as FieldTree<TReturn, string> } as DiscriminatedField;
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
