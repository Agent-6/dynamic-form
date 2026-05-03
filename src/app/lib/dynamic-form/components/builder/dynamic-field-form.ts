import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  model,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import {
  apply,
  applyEach,
  applyWhen,
  type FieldTree,
  FormField,
  form,
  minLength,
  type PathKind,
  readonly,
  required,
  type SchemaPathTree,
  schema,
  submit,
} from '@angular/forms/signals';
import { InputComponent } from '@ui/input/input.component';
import { SelectComponent } from '@ui/select/select.component';
import { DynamicFormService } from './dynamic-form-builder.service';
import { DynamicFieldComponent } from '../field/dynamic-field';
import { applyTypeValidators, initValidatorsByType } from '@dynamic-form/types/validation';
import { DiscriminatedField, FormControl, isType } from '@dynamic-form/types/utils';
import { SelectControl, SelectControlOption } from '@dynamic-form/types/controls/select';
import { DateControl } from '@dynamic-form/types/controls/date';

@Component({
  selector: 'app-dynamic-field-form',
  templateUrl: './dynamic-field-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    InputComponent,
    SelectComponent,
    FormField,
    DynamicFieldComponent,
  ],
})      
export class DynamicFormFieldComponent {
  public readonly show = model.required<boolean>();
  public readonly controlId = input.required<string | undefined>();

  private readonly service = inject(DynamicFormService);

  protected readonly isType = isType;
  
  protected readonly mode = computed<'edit' | 'create'>(() =>
    this.controlId() ? 'edit' : 'create',
  );

  protected readonly control = linkedSignal<FormControl>(() => {
    const control = this.service.controls().find((c) => c.id === this.controlId());
    return (
      control || ({
        id: crypto.randomUUID(),
        key: '',
        type: 'text',
        value: '',
        label: '',
      })
    );
  });

  private optionsSchema = schema<SelectControlOption[]>((options) => {
    required(options, { message: 'Select options are required' });
    minLength(options, 1, { message: 'At least one option is required' });
    applyEach(options, (option) => {
      required(option, { message: 'Option is required' });
      required(option.name, { message: 'Option name is required' });
      readonly(option.id);
      required(option.id, { message: 'Option id is required' });
    });
  });

  protected readonly form = form(this.control, (control) => {
    required(control.type, { message: 'field is required' });
    required(control.key, { message: 'field is required' });

    applyWhen(
      control,
      ({ value }) => value().type === 'select',
      (control) => {
        const selectControl = control as SchemaPathTree<SelectControl, PathKind.Root>;
        apply(selectControl.options, this.optionsSchema);
      },
    );

    applyTypeValidators(control.value, () => this.control());
  });

  protected readonly selectOptionsForm = computed(() => {
    if (this.control().type !== 'select') return null;

    const selectForm = this.form as FieldTree<SelectControl, string | number>;
    return selectForm.options;
  });

  protected readonly dateConfigForm = computed(() => {
    if (this.control().type !== 'date') return null;

    return this.form as FieldTree<DateControl, string>;
  });

  addOption() {
    const optionsForm = this.selectOptionsForm();
    if (!optionsForm) return;

    optionsForm().value.update((options) => [
      ...options,
      { id: `${options.length + 1}`, name: '' },
    ]);
  }

  removeOption(index: number) {
    const optionsForm = this.selectOptionsForm();
    if (!optionsForm) return;

    optionsForm().value.update((options) => {
      options.splice(index, 1);
      options.forEach((o, i) => {
        o.id = `${i + 1}`;
      });
      return options;
    });
  }

  readonly typeOptions = signal<{ id: FormControl['type']; name: string }[]>([
    { id: 'text', name: 'Text' },
    { id: 'number', name: 'Number' },
    { id: 'select', name: 'Select' },
    { id: 'email', name: 'Email' },
    { id: 'password', name: 'Password' },
    { id: 'url', name: 'URL' },
    { id: 'color', name: 'Color' },
    { id: 'date', name: 'Date' },
  ]);

  constructor() {
    effect(() => {
      const control = this.control();
      if (control.type === 'select' && !control.options) {
        this.control.update((c) => ({ ...c, options: [] }) as FormControl);
      }
      if (control.type === 'date' && (!control.depth || !control.mode)) {
        this.control.update((c) => ({ ...c, depth: 'day', mode: 'single' }) as DateControl);
      }
    });
  }

  getFieldData<T extends FormControl>(control: T): DiscriminatedField {
    return {
      control: { ...control, label: 'Default Value', placeholder: 'Enter a default value' },
      field: this.form.value as FieldTree<T['value'], string>,
    } as DiscriminatedField;
  }

  initValidators() {
    this.control.update((control) => ({
      ...control,
      validators: initValidatorsByType(control.type),
    }) as FormControl);
  }

  submit() {
    submit(this.form, async (form) => {
      const control: FormControl = form().value() as FormControl;

      try {
        this.mode() === 'create'
          ? this.service.addControl(control)
          : this.service.updateControl(control.id, control);

        this.show.set(false);
      } catch {
        return [
          {
            fieldTree: this.form.key,
            kind: 'NotUnique',
            message: 'Duplicate key',
          },
        ];
      }

      return null;
    });
  }
}
