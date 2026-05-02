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
import {
  applyTypeValidators,
  type getControlFormContext,
  type IFormControl,
  type DiscriminatedField,
} from '../dynamic-form.model';
import { FormFieldRendererComponent } from '../form-field-renderer';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [JsonPipe, FormFieldRendererComponent],
})
export class DynamicFormComponent<TControl extends IFormControl = IFormControl> {
  readonly controls = input.required<TControl[]>();
  readonly fieldTemplate = contentChild<TemplateRef<{ $implicit: TControl; field: FieldTree<any, any> }>>('fieldTemplate');

  readonly validatorsMap = computed(() => {
    const map: { [key: string]: any } = {};
    for (const control of this.controls()) {
      map[control.name] = control.validators;
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
    const controlName = fieldTree().keyInParent() as string;
    const control = (this.controls() as IFormControl[]).find((c) => c.name === controlName);
    return control;
  };

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

    applyTypeValidators(controlValue, this.getControl);
  });

  readonly formState = linkedSignal<TControl[], { [key: IFormControl['name']]: IFormControl['value'] }>({
    source: this.controls,
    computation: (controls, previous) => {
      const state = {} as { [key: IFormControl['name']]: IFormControl['value'] };
      for (const control of controls) {
        state[control.name] = previous?.value?.[control.name] ?? control.value;
      }

      return state;
    }
  });

  readonly form = form(this.formState, (schema) => {
    applyEach(schema, this.controlSchema);
  });

  getFieldData<
    TControl extends IFormControl,
    TReturn extends TControl['value']
  >(
    control: TControl
  ): DiscriminatedField {
    return { control, field: this.form[control.name] as FieldTree<TReturn, string> } as DiscriminatedField;
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
