# Library Implementation Guide: Custom Dynamic Forms

This guide explains how to use the `lib-dynamic-form` library to create a bespoke dynamic form system tailored to your application's needs.

## 1. Define Your Control Types

First, define the set of control types your application will support.

```typescript
export type MyFormControlType = 'text' | 'number' | 'email' | 'toggle';
```

## 2. Define Type-Specific Configurations

Create interfaces for each control type, extending `BaseFieldConfig`.

```typescript
export interface MyTextConfig extends BaseFieldConfig<'text' | 'email', string> {
  minLength?: number;
  maxLength?: number;
}

export interface MyNumberConfig extends BaseFieldConfig<'number', number> {
  min?: number;
  max?: number;
}
```

## 3. Create Custom Field Components

For each type, create a component that extends `AbstractFormField`. This allows you to use any UI library or custom styling.

```typescript
@Component({
  selector: 'app-my-input',
  template: `
    <label>{{ config().label }}</label>
    <input 
      [type]="config().type"
      [value]="fieldTree().value()"
      (input)="fieldTree().value.set($any($event.target).value)"
      [disabled]="fieldTree().disabled()"
    />
    @if (fieldTree().invalid()) {
      <span class="error">Field is invalid</span>
    }
  `
})
export class MyInputComponent extends AbstractFormField<MyTextConfig> {
  config = input.required<MyTextConfig>();
  fieldTree = input.required<FieldTree<string, any>>();
}
```

## 4. Register Your Types

Create a registry that maps your types to their respective components and value types.

```typescript
export const MY_FORM_REGISTRY: LibraryRegistry<MyFormControlType> = {
  text: { component: MyInputComponent, valueType: '' },
  email: { component: MyInputComponent, valueType: '' },
  number: { component: MyNumberComponent, valueType: 0 },
  toggle: { component: MyToggleComponent, valueType: false },
};
```

## 5. Provide the Registry

In your application or component providers, provide the `DYNAMIC_FORM_REGISTRY` token.

```typescript
bootstrapApplication(AppComponent, {
  providers: [
    { provide: DYNAMIC_FORM_REGISTRY, useValue: MY_FORM_REGISTRY }
  ]
});
```

## 6. Using the Dynamic Form

Now you can use the `lib-dynamic-form` component with your JSON configuration.

### Validator DSL

The library supports a DSL for validators, allowing for complex, conditional logic defined in JSON.

```json
[
  {
    "id": "1",
    "type": "text",
    "name": "firstName",
    "label": "First Name",
    "value": "",
    "validators": {
      "required": "true"
    }
  },
  {
    "id": "2",
    "type": "email",
    "name": "email",
    "label": "Email Address",
    "value": "",
    "validators": {
      "required": "form.firstName.length > 0",
      "requiredMessage": "Email is required if First Name is provided"
    }
  }
]
```

The DSL context provides:
- `form`: The entire form value object.
- `value`: The current field's value.
- `name`: The current field's name.

## 7. Rendering the Form

```html
<lib-dynamic-form [controls]="formConfig" />
```

---

## Key Features of this Approach

1.  **Agnostic UI**: The library doesn't care about your UI components. You just provide the components that match the config.
2.  **JSON-Driven Logic**: Conditional validation is handled via the DSL, making it possible to change form behavior without code deployments.
3.  **Signal Integration**: Built on top of `@angular/forms/signals` for modern, reactive performance.
4.  **Strict Type Safety**: Generics ensure that your field components receive the correct configuration type.
