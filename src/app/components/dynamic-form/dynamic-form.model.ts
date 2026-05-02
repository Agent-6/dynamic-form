import {
  applyWhen,
  email,
  type PathKind,
  type RootFieldContext,
  type SchemaOrSchemaFn,
  type SchemaPath,
  type SchemaPathTree,
  validate,
} from '@angular/forms/signals';

export type FormControlType =
  | 'text'
  | 'textarea'
  | 'password'
  | 'number'
  | 'array'
  | 'email'
  | 'url'
  | 'tel'
  | 'search'
  | 'date'
  | 'time'
  | 'datetime'
  | 'month'
  | 'week'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'toggle'
  | 'autocomplete'
  | 'chips'
  | 'file'
  | 'slider'
  | 'color'
  | 'range'
  | 'richtext'
  | 'readonly'
  | 'hidden';

const url = (field: SchemaPathTree<string>, options?: { message: string }) => {
  validate(field, ({ value }) => {
    try {
      new URL(value());
      return null;
    } catch {
      return { kind: 'url', message: options?.message || 'URL format is not correct' };
    }
  });
};

export interface Validators {
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
}

export const validatorsRegistry: Partial<
  Record<FormControlType, NoInfer<SchemaOrSchemaFn<IFormControl['value'], PathKind.Root>>>
> = {
  email: (emailValue) =>
    email(emailValue as unknown as SchemaPath<string>, { message: 'Email format is not correct' }),
  url: (urlValue) => url(urlValue as unknown as SchemaPath<string>),
};

export type getControlFormContext = (
  ctx: RootFieldContext<IFormControl['value']>,
) => IFormControl | undefined;

export const applyTypeValidators = (
  path: SchemaPath<IFormControl['value']>,
  getControl: getControlFormContext,
) => {
  Object.entries(validatorsRegistry).forEach(([key, validator]) => {
    applyWhen(path, (ctx) => getControl(ctx)?.type === key && !!ctx.value(), validator);
  });
};

export function initValidatorsByType(type: string): any {
  const baseValidators: Validators = {
    required: false,
    disabled: false,
    readonly: false,
  };

  switch (type) {
    case 'text':
    case 'textarea':
    case 'email':
    case 'password':
    case 'url':
    case 'tel':
    case 'search':
      return {
        ...baseValidators,
        minLength: undefined,
        maxLength: undefined,
        pattern: undefined,
      };

    case 'number':
      return {
        ...baseValidators,
        min: undefined,
        max: undefined,
        step: undefined,
      };

    default:
      return baseValidators;
  }
}

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

export type TextValidators = Validators & {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
};

export type NumberValidators = Validators & {
  min?: number;
  max?: number;
  step?: number;
};

export type BasicControlTypes =
  | 'text'
  | 'textarea'
  | 'email'
  | 'password'
  | 'url'
  | 'tel'
  | 'search'
  | 'number';

export type TextControl = BaseFormControl<
  Exclude<BasicControlTypes, 'number'>,
  string,
  TextValidators
>;

export type NumberControl = BaseFormControl<'number', number, NumberValidators>;

export type ColorControl = BaseFormControl<'color', string, Validators>;

export interface SelectControlOption {
  id: string;
  name: string;
}

export type SelectVariantType = 'id' | 'option' | 'multi';

export interface SelectControl extends BaseFormControl<'select', any, Validators> {
  options: SelectControlOption[];
  variant: SelectVariantType;
}

export type IFormControl = TextControl | NumberControl | SelectControl | ColorControl;


type TextControlType = 'text' | 'email' | 'password' | 'url';
type NumberControlType = 'number';
type SelectControlType = 'select';

// Type predicate for text controls
export const isText = (
  control: any,
): control is TextControl => {
  const types: string[] = ['text', 'textarea', 'email', 'password', 'url', 'tel', 'search'];
  return types.includes(control.type);
};

// Type predicate for number controls
export const isNumber = (
  control: any,
): control is NumberControl => {
  return control.type === 'number';
};

// Type predicate for select controls
export const isSelect = (
  control: any,
): control is SelectControl => {
  return control.type === 'select';
};

export const isColor = (
  control: any,
): control is ColorControl => {
  return control.type === 'color';
};
