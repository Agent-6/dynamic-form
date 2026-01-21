import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  model,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import {
  applyEach,
  disabled,
  Field,
  type FieldTree,
  form,
  type MaybeFieldTree,
  required,
  submit,
  validate,
} from '@angular/forms/signals';
import type { FormControlType, IFormControl } from '../../dynamic-form/dynamic-form.model';
import { NumberComponent } from '../../ui/number/number.component';
import { SelectComponent } from '../../ui/select/select.component';
import { TextComponent } from '../../ui/text/text.component';
import { ControlValueByType } from '../type-utils';

@Component({
  selector: 'app-dynamic-form-builder',
  templateUrl: './dynamic-form-builder.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [Field, JsonPipe, SelectComponent, TextComponent, NumberComponent],
})
export class DynamicFormBuilderComponent {
  readonly controls = model<IFormControl[]>([]);
  readonly controlsForm = form(this.controls, (form) => {
    applyEach(form, (control) => {
      required(control.type, { message: 'field is required' });
      required(control.name, { message: 'field is required' });
      // biome-ignore lint/suspicious/noShadowRestrictedNames: this is not a global property
      validate(control.name, ({ valueOf }) => {
        const field = valueOf(control);
        if (!field.name) return null;

        const fields = valueOf(form);
        const match = fields.find((f) => f.name === field.name && f.id !== field.id);
        return match ? { kind: 'NotUnique', message: 'Duplicate name' } : null;
      });

      if (control.validators) {
        disabled(control.validators, ({ stateOf }) => {
          const nameState = stateOf(control.name);
          return !nameState.valid() ? 'name is required' : false;
        });
      }
    });
  });

  readonly typeOptions = signal([
    { id: 'text', name: 'Text' },
    { id: 'number', name: 'Number' },
  ]);

  addField() {
    submit(this.controlsForm, async () => {
      this.controls.update((controls) => [
      ...controls,
      {
        id: crypto.randomUUID(),
        type: 'text',
        name: '',
        label: '',
        value: '',
        validators: {
          required: true,
          disabled: true,
          readonly: true,
        },
      },
    ]);

      // TODO: call server
      return null;
    });
  }

  configField(id: string) {
    // const control = this.controls().find((c) => c.id === id);
    // const controls = this.controls.update((controls) => controls.filter(c));
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
}
