# Dynamic Form System Documentation

This document explains the architecture and implementation of the dynamic form system and library within this project.

## Overview

The Dynamic Form System is a flexible, signal-based library for building and rendering complex forms in Angular. It leverages the new `@angular/forms/signals` API to provide a performant, type-safe, and reactive form management experience.

The system is divided into two main parts:
1.  **Form Library**: Core logic for rendering forms based on a configuration array.
2.  **Form Builder**: A set of tools to dynamically create and edit form configurations.

---

## Core Concepts

### 1. Control Configuration (`IFormControl`)
The system is driven by a configuration object for each field. The base interface `BaseFormControl` defines the common properties, and specialized types handle specific field requirements.

#### Implementation: `dynamic-form.model.ts`
```typescript
export interface BaseFormControl<TType extends string, TValue, TValidators = any, TMeta = any> {
  id: string;
  type: TType;
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  value: TValue;
  validators?: TValidators;
  meta?: TMeta;
}

export type TextControl = BaseFormControl<Exclude<BasicControlTypes, 'number'>, string, TextValidators>;
export type NumberControl = BaseFormControl<'number', number, NumberValidators>;
export type SelectControl = BaseFormControl<'select', any, Validators> & {
  options: SelectControlOption[];
  variant: SelectVariantType;
};
export type ColorControl = BaseFormControl<'color', string, Validators>;

export type IFormControl = TextControl | NumberControl | SelectControl | ColorControl;
```

### 2. Signals-Based Forms
The system uses `@angular/forms/signals` for form management.

---

## Architecture & Components

### `DynamicFormComponent`
The main component for rendering dynamic forms. It generates a reactive schema based on the provided controls.

#### Implementation: `dynamic-form.ts`
```typescript
@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.html',
  // ...
})
export class DynamicFormComponent<TControl extends BaseFormControl<string, any> = IFormControl> {
  readonly controls = input.required<TControl[]>();

  // Schema definition based on control configuration
  private readonly controlSchema = schema<any>((controlValue) => {
    required(controlValue, {
      message: 'field is required',
      when: this.getValidator((validators) => !!validators?.required),
    });

    disabled(controlValue, this.getValidator((validators) => 
      (validators?.disabled ? 'field is disabled' : false)));

    readonly(controlValue, this.getValidator((validators) => !!validators?.readonly));

    applyTypeValidators(controlValue as unknown as any, this.getControl);
  });

  // Reactive form state
  readonly formState = linkedSignal(() => {
    const controls: { [key: string]: any } = {};
    for (const control of this.controls()) {
      controls[control.name] = control.value;
    }
    return controls;
  });

  readonly form = form(this.formState, (schema) => {
    applyEach(schema, this.controlSchema);
  });
}
```

### `FormFieldRendererComponent`
Responsible for selecting and rendering the appropriate UI component for a control.

#### Implementation: `form-field-renderer.ts`
```typescript
@Component({
  selector: 'app-form-field-renderer',
  template: `
    @let c = control();
    @let f = field();

    @if (isText(c)) {
      <ui-input [label]="c.label || ''" [placeholder]="c.placeholder" [formField]="$any(f)" [type]="c.type" />
    } @else if (isNumber(c)) {
      <ui-number [label]="c.label || ''" [placeholder]="c.placeholder" [formField]="$any(f)" />
    } @else if (isSelect(c)) {
      <ui-select [label]="c.label || ''" [placeholder]="c.placeholder" [formField]="$any(f)" [options]="c.options" />
    } @else if (isColor(c)) {
      <ui-color-picker [label]="c.label || ''" [formField]="$any(f)" />
    }
  `,
  // ...
})
export class FormFieldRendererComponent {
  control = input.required<IFormControl>();
  field = input.required<FieldTree<any, any>>();
}
```

---

## Form Builder Implementation

### `DynamicFormService`
Manages the list of controls being edited in the builder.

#### Implementation: `dynamic-form-builder.service.ts`
```typescript
@Injectable()
export class DynamicFormService {
  private readonly _controls = signal<IFormControl[]>([]);
  public readonly controls = this._controls.asReadonly();

  addControl(control: IFormControl) {
    // ... validation for unique ID and name
    this._controls.update((controls) => [...controls, control]);
  }

  updateControl(id: string, updatedControl: Partial<IFormControl>) {
    // ... logic to update existing control
  }
}
```

### `DynamicFormFieldComponent`
The builder's form for configuring individual fields.

#### Implementation: `dynamic-field-form.ts`
```typescript
@Component({
  selector: 'app-dynamic-field-form',
  // ...
})
export class DynamicFormFieldComponent {
  // Uses linkedSignal to sync with the selected control
  protected readonly control = linkedSignal<IFormControl>(() => {
    const control = this.service.controls().find((c) => c.id === this.controlId());
    return control || { id: crypto.randomUUID(), name: '', type: 'text', value: '', label: '' };
  });

  // Internal form for editing the control itself
  protected readonly form = form(this.control, (control) => {
    required(control.type, { message: 'field is required' });
    required(control.name, { message: 'field is required' });
    // ... conditional validation for select options
  });
}
```

---

## Utility Types

### `type-utils.ts`
Helper types for working with control types and their values.

```typescript
export type ControlByType<T extends FormControlType> = Extract<IFormControl, { type: T }>;

export type ControlValueByType<T extends FormControlType> = ControlByType<T>['value'];

export type ControlsByTypes<T extends readonly FormControlType[]> = Extract<
  IFormControl,
  { type: T[number] }
>;

export type ControlValuesByTypes<T extends readonly FormControlType[]> =
  ControlsByTypes<T>['value'];
```

---

## UI Component Integration

The dynamic form system relies on a set of UI components that implement a specific interface to work with `FieldTree`.

### Example: `InputComponent` (Snippet)
```typescript
@Component({
  selector: 'ui-input',
  // ...
})
export class InputComponent {
  label = input.required<string>();
  placeholder = input<string>();
  formField = input.required<FieldTree<string, any>>();
  type = input<string>('text');
}
```

---

## Extension Guidelines

To add a new field type:
1.  **Update the Model**: Add the new type to `FormControlType` and create a specific interface in `dynamic-form.model.ts`.
2.  **Add Type Guard**: Create a new `isYourType` guard.
3.  **Update Renderer**: Add the new type to `FormFieldRendererComponent` and map it to a UI component.
4.  **Update Builder**: Add the new type to the `typeOptions` in `DynamicFormFieldComponent`.
