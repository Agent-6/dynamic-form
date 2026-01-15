import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  linkedSignal,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import {
  applyEach,
  Field,
  type FieldTree,
  form,
  type MaybeFieldTree,
  required,
  submit,
} from '@angular/forms/signals';
import type { FormControlType, IFormControl } from './dynamic-form.model';
import { SelectComponent } from '../ui/select/select.component';
import { TextComponent } from "../ui/text/text.component";
import { NumberComponent } from "../ui/number/number.component";

type ControlByType<T extends readonly FormControlType[]> = Extract<
  IFormControl,
  { type: T[number] }
>;

type ControlValueByType<T extends readonly FormControlType[]> = ControlByType<T>['value'];

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
      required(control.type);
      required(control.name);
      // biome-ignore lint/suspicious/noShadowRestrictedNames: angular function
      // validate(control.name, ({ value, valueOf }) => {
      //   const name = value();
      //   const names = valueOf(form).map((c) => c.name);

      //   if (names.includes(name)) return new StandardSchemaValidationError({ path: control.name });
      // });
    });
  });

  readonly formControls = linkedSignal<{ [key: string]: IFormControl['value'] }>(() => {
    const controls: { [key: IFormControl['name']]: IFormControl['value'] } = {};
    for (const control of this.controls()) {
      controls[control.name] = control.value;
    }

    return controls;
  });
  readonly form = form(this.formControls);

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
        }
      },
    ]);
  }

  removeField(id: string) {
    this.controls.update((controls) => controls.filter((c) => c.id !== id));
  }

  castValueToTypes<T extends readonly FormControlType[]>(
    expectedTypes: T,
    control: MaybeFieldTree<IFormControl, number>,
  ): FieldTree<ControlValueByType<T>, string> | null {
    if (expectedTypes.includes(control.type().value() as T[number])) {
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
