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
  email,
  type FieldTree,
  FormField,
  form,
  minLength,
  type PathKind,
  readonly,
  required,
  type SchemaPath,
  type SchemaPathTree,
  schema,
  submit,
} from '@angular/forms/signals';
import { InputComponent } from '../../ui/input/input.component';
import { NumberComponent } from '../../ui/number/number.component';
import { SelectComponent } from '../../ui/select/select.component';
import type {
  FormControlType,
  IFormControl,
  SelectControl,
  SelectControlOption,
} from '../dynamic-form.model';
import { DynamicFormService } from './dynamic-form-builder.service';

@Component({
  selector: 'app-dynamic-field-form',
  templateUrl: './dynamic-field-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [InputComponent, NumberComponent, SelectComponent, FormField],
})
export class DynamicFormFieldComponent {
  public readonly show = model.required<boolean>();
  public readonly controlId = input.required<string | undefined>();

  private readonly service = inject(DynamicFormService);

  protected readonly mode = computed<'edit' | 'create'>(() =>
    this.controlId() ? 'edit' : 'create',
  );

  protected readonly control = linkedSignal<IFormControl>(() => {
    const control = this.service.controls().find((c) => c.id === this.controlId());
    return (
      control || {
        id: crypto.randomUUID(),
        name: '',
        type: 'text',
        value: '',
        label: '',
      }
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

  private readonly controlValueSchema = schema<IFormControl['value']>((controlValue) => {
    applyWhen(
      controlValue,
      () => this.control().type === 'email',
      (emailValue) =>
        email(emailValue as SchemaPath<string>, { message: 'Email format is not correct' }),
    );
  });

  protected readonly form = form(this.control, (control) => {
    required(control.type, { message: 'field is required' });
    required(control.name, { message: 'field is required' });

    applyWhen(
      control,
      ({ value }) => value().type === 'select',
      (control) => {
        const selectControl = control as SchemaPathTree<SelectControl, PathKind.Root>;
        apply(selectControl.options, this.optionsSchema);
      },
    );

    apply(control.value as SchemaPath<IFormControl['value']>, this.controlValueSchema);
  });

  protected readonly selectOptionsForm = computed(() => {
    if (this.control().type !== 'select') return null;

    const selectForm = this.form as FieldTree<SelectControl, string | number>;
    return selectForm.options;
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

  readonly typeOptions = signal<{ id: FormControlType; name: string }[]>([
    { id: 'text', name: 'Text' },
    { id: 'number', name: 'Number' },
    { id: 'select', name: 'Select' },
    { id: 'email', name: 'Email' },
  ]);

  constructor() {
    effect(() => {
      const control = this.control();
      if (control.type === 'select' && !control.options) {
        this.control.update((c) => ({ ...c, options: [] }) as IFormControl);
      }
    });
  }

  getValueField<T extends IFormControl>(_control: T): FieldTree<T['value'], string> {
    return this.form.value as FieldTree<T['value'], string>;
  }

  submit() {
    submit(this.form, async (form) => {
      const control: IFormControl = form().value();

      try {
        this.mode() === 'create'
          ? this.service.addControl(control)
          : this.service.updateControl(control.id, control);

        this.show.set(false);
      } catch {
        return [
          {
            fieldTree: this.form.name,
            kind: 'NotUnique',
            message: 'Duplicate name',
          },
        ];
      }

      return null;
    });
  }
}
