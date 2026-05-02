import { JsonPipe, NgTemplateOutlet } from '@angular/common';
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
  FormField,
  form,
  type LogicFn,
  readonly,
  required,
  schema,
  type SchemaPath,
  submit,
} from '@angular/forms/signals';
import { InputComponent } from '../../ui/input/input.component';
import { NumberComponent } from '../../ui/number/number.component';
import { SelectComponent } from '../../ui/select/select.component';
import {
  applyTypeValidators,
  type BaseFormControl,
  type getControlFormContext,
  type IFormControl,
  isNumber,
  isSelect,
  isText,
} from '../dynamic-form.model';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormField, NgTemplateOutlet, SelectComponent, InputComponent, NumberComponent, JsonPipe],
})
export class DynamicFormComponent<TControl extends BaseFormControl<string, any> = IFormControl> {
  readonly controls = input.required<TControl[]>();
  readonly fieldTemplate = contentChild<TemplateRef<{ $implicit: TControl; field: FieldTree<any, any> }>>('fieldTemplate');

  readonly validatorsMap = computed(() => {
    const map: { [key: string]: any } = {};
    for (const control of this.controls()) {
      map[control.name] = control.validators;
    }

    return map;
  });

  isText = isText;
  isNumber = isNumber;
  isSelect = isSelect;

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

  private readonly controlSchema = schema<any>((controlValue) => {
    required(controlValue as unknown as SchemaPath<any>, {
      message: 'filed is required',
      when: this.getValidator((validators) => !!validators?.required),
    });

    disabled(
      controlValue as unknown as SchemaPath<any>,
      this.getValidator((validators) => (validators?.disabled ? 'field is disabled' : false)),
    );

    readonly(
      controlValue as unknown as SchemaPath<any>,
      this.getValidator((validators) => !!validators?.readonly),
    );

    applyTypeValidators(controlValue as unknown as any, this.getControl);
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

  getField(
    control: TControl,
  ): FieldTree<any, string> {
    return (this.form as any)[control.name] as FieldTree<any, string>;
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
