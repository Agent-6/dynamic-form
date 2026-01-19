import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  linkedSignal,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import {
  applyEach,
  applyWhen,
  disabled,
  Field,
  type FieldTree,
  form,
  type MaybeFieldTree,
  required,
  schema,
  submit,
  validate,
} from '@angular/forms/signals';
import type { FormControlType, IFormControl } from './dynamic-form.model';
import { SelectComponent } from '../ui/select/select.component';
import { TextComponent } from "../ui/text/text.component";
import { NumberComponent } from "../ui/number/number.component";

export type ControlByType<T extends FormControlType> = Extract<
  IFormControl,
  { type: T }
>;

export type ControlValueByType<T extends FormControlType> = 
  ControlByType<T>['value'];

export type ControlsByTypes<T extends readonly FormControlType[]> = Extract<
  IFormControl,
  { type: T[number] }
>;

export type ControlValuesByTypes<T extends readonly FormControlType[]> = 
  ControlsByTypes<T>['value'];

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Field, JsonPipe, SelectComponent, TextComponent, NumberComponent],
})
export class DynamicFormComponent {
  readonly controls = signal<IFormControl[]>([]);
  readonly controlsForm = form(this.controls, (form) => {
    applyEach(form, (control) => {
      required(control.type, { message: 'field is required' });
      required(control.name, { message: 'field is required' });
      validate(control.name, ({ valueOf }) => {
        const field = valueOf(control);
        if (!field.name) return null;

        const fields = valueOf(form);
        const match = fields.find(f => f.name === field.name && f.id !== field.id);
        return match ? { kind: 'NotUnique', message: 'Duplicate name' } : null;
      });
    });
  });

  readonly formControls = linkedSignal<{ [key: string]: IFormControl['value'] }>(() => {
    const controls: { [key: IFormControl['name']]: IFormControl['value'] } = {};
    for (const control of this.controls()) {
      controls[control.name] = control.value;
    }

    return controls;
  });

  validators(key: string) {
    return computed(() => {
      return this.controls().find(c => c.name === key)?.validators;
    })
  }

  readonly controlSchema = schema((control) => {
    applyWhen(control, ({ fieldTree }) => { 
      const key = fieldTree().keyInParent().toString();
      const validators = this.validators(key);

      console.log("required", { key: key, control: validators()?.required });
      return !!validators()?.required;
    }, (path) => required(path, { message: 'field is required' }));

    disabled(control, ({ fieldTree }) => { 
      const key = fieldTree().keyInParent();
      const control = this.controls().find(c => c.name === key);

      console.log("disabled", { key: key, control: control?.validators?.disabled });
      return control?.validators?.disabled ? 'field is disabled' : false;
    });
  });

  readonly form = form(this.formControls, (schema) => {
    applyEach(schema, this.controlSchema);
  });

  readonly typeOptions = signal([
    { id: 'text', name: 'Text' },
    { id: 'number', name: 'Number' },
  ]);

  trackById(_index: number, control: IFormControl) {
    return control.id;
  }

  readonly controlFieldById = linkedSignal(() => {
    const map = new Map<string, MaybeFieldTree<IFormControl, number>>();
    for (const control of this.controlsForm) {
      map.set(control.id().value(), control);
    }

    return map;
  });

  addField() {
    this.controls.update((controls) => [
      ...controls,
      {
        id: crypto.randomUUID(),
        type: 'text',
        name: '',
        label: '',
        value: '',
        maxLength: 250,
        min: 8,
        validators: {
          required: true,
          disabled: true,
        }
      },
    ]);
  }

  removeField(id: string) {
    this.controls.update((controls) => controls.filter((c) => c.id !== id));
  }

  castControlToType<T extends FormControlType>(
    expectedType: T,
    control: MaybeFieldTree<IFormControl, number>,
  ): FieldTree<ControlValueByType<T>, string> | null {
    if (expectedType === control.type().value()) {
      return control.value as unknown as FieldTree<ControlValueByType<T>, string>;
    }
    return null;
  }

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
