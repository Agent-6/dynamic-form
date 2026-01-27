import { JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
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
import type { ControlValueByType } from '../type-utils';
import { DynamicFormFieldComponent } from './dynamic-field-form';
import { DynamicFormService } from './dynamic-form-builder.service';

@Component({
  selector: 'app-dynamic-form-builder',
  templateUrl: './dynamic-form-builder.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [JsonPipe, DynamicFormFieldComponent],
})
export class DynamicFormBuilderComponent {
  private readonly service = inject(DynamicFormService);
  protected readonly controls = this.service.controls;

  protected readonly show = signal<boolean>(false);
  protected readonly selectedId = signal<string | undefined>(undefined);

  readonly typeOptions = signal<{ id: FormControlType; name: string }[]>([
    { id: 'text', name: 'Text' },
    { id: 'number', name: 'Number' },
    { id: 'select', name: 'Select' },
  ]);

  addField() {
    this.show.set(true);
    this.selectedId.set(undefined);
  }

  configField(id: string) {
    this.show.set(true);
    this.selectedId.set(id);
  }

  removeField(id: string) {
    this.service.removeControl(id);
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
