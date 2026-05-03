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
import { applyTypeValidators, dateValidator, initValidatorsByType } from '@dynamic-form/types/validation';
import { DiscriminatedField, FormControl, isType } from '@dynamic-form/types/utils';
import { SelectControl, SelectControlOption } from '@dynamic-form/types/controls/select';
import { DateControl } from '@dynamic-form/types/controls/date';
import { TimeControl } from '@dynamic-form/types/controls/time';
import { TextareaControl } from '@dynamic-form/types/controls/textarea';
import { CheckboxControl } from '@dynamic-form/types/controls/checkbox';
import { RadioControl } from '@dynamic-form/types/controls/radio';
import { CheckboxGroupControl } from '@dynamic-form/types/controls/checkbox-group';
import { DateComponent } from "@ui/date/date.component";
import { TimeComponent } from "@ui/time/time.component";
import { CheckboxComponent } from "@ui/checkbox/checkbox.component";
import { timeValidator } from '@dynamic-form/types/validation';
import { NumberComponent } from "@ui/number/number.component";

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
    DateComponent,
    TimeComponent,
    NumberComponent,
    CheckboxComponent,
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

    applyWhen(
      control,
      ({ value }) => value().type === 'radio',
      (control) => {
        const radioControl = control as SchemaPathTree<RadioControl, PathKind.Root>;
        apply(radioControl.options, this.optionsSchema);
      },
    );

    applyWhen(
      control,
      ({ value }) => value().type === 'checkbox-group',
      (control) => {
        const groupControl = control as SchemaPathTree<CheckboxGroupControl, PathKind.Root>;
        apply(groupControl.options, this.optionsSchema);
      },
    );

    applyWhen(
      control,
      ({ value }) => value().type === 'date',
      (control) => {
        const dateControl = control as SchemaPathTree<DateControl, PathKind.Root>;
        apply(dateControl.validators?.min!, (field) => dateValidator(field, () => this.control()))
        apply(dateControl.validators?.max!, (field) => dateValidator(field, () => this.control()))
      },
    );

    applyWhen(
      control,
      ({ value }) => value().type === 'time',
      (control) => {
        const timeControl = control as SchemaPathTree<TimeControl, PathKind.Root>;
        apply(timeControl.validators?.min!, (field) => timeValidator(field, () => this.control()))
        apply(timeControl.validators?.max!, (field) => timeValidator(field, () => this.control()))
      },
    );
 
    applyTypeValidators(control.value, () => this.control());
  });

  protected readonly selectOptionsForm = computed(() => {
    const type = this.control().type;
    if (type !== 'select' && type !== 'radio' && type !== 'checkbox-group') return null;

    if (type === 'select') {
      const selectForm = this.form as FieldTree<SelectControl, string | number>;
      return selectForm.options;
    } else if (type === 'radio') {
      const radioForm = this.form as FieldTree<RadioControl, string | number>;
      return radioForm.options;
    } else {
      const groupForm = this.form as FieldTree<CheckboxGroupControl, string | number>;
      return groupForm.options;
    }
  });

  protected readonly dateConfigForm = computed(() => {
    if (this.control().type !== 'date') return null;

    return this.form as FieldTree<DateControl, string>;
  });

  protected readonly timeConfigForm = computed(() => {
    if (this.control().type !== 'time') return null;

    return this.form as FieldTree<TimeControl, string>;
  });

  protected readonly textareaConfigForm = computed(() => {
    if (this.control().type !== 'textarea') return null;

    return this.form as FieldTree<TextareaControl, string>;
  });

  protected readonly checkboxConfigForm = computed(() => {
    const type = this.control().type;
    if (type !== 'checkbox' && type !== 'checkbox-group') return null;

    if (type === 'checkbox') {
      return this.form as FieldTree<CheckboxControl, string>;
    } else {
      return this.form as FieldTree<CheckboxGroupControl, string>;
    }
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
    { id: 'textarea', name: 'Textarea' },
    { id: 'number', name: 'Number' },
    { id: 'select', name: 'Select' },
    { id: 'email', name: 'Email' },
    { id: 'password', name: 'Password' },
    { id: 'url', name: 'URL' },
    { id: 'color', name: 'Color' },
    { id: 'date', name: 'Date' },
    { id: 'time', name: 'Time' },
    { id: 'checkbox', name: 'Checkbox' },
    { id: 'radio', name: 'Radio' },
    { id: 'checkbox-group', name: 'Checkbox Group' },
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
      if (control.type === 'time' && (!control.format || !control.mode)) {
        this.control.update((c) => ({ ...c, format: '24h', mode: 'single' }) as TimeControl);
      }
      if (control.type === 'textarea' && !control.rows) {
        this.control.update((c) => ({ ...c, rows: 3 }) as TextareaControl);
      }
      if (control.type === 'checkbox' && (!control.variant || control.value === undefined)) {
        this.control.update((c) => ({ ...c, variant: 'checkbox', value: false }) as CheckboxControl);
      }
      if (control.type === 'radio' && !control.options) {
        this.control.update((c) => ({ ...c, options: [] }) as RadioControl);
      }
      if (control.type === 'checkbox-group' && (!control.options || !control.variant || control.value === undefined)) {
        this.control.update((c) => ({ ...c, options: [], variant: 'checkbox', value: [] }) as CheckboxGroupControl);
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
