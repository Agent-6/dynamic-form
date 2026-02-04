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

export const validatorsRegistry: Partial<
  Record<FormControlType, NoInfer<SchemaOrSchemaFn<IFormControl['value'], PathKind.Root>>>
> = {
  email: (emailValue) =>
    email(emailValue as SchemaPath<string>, { message: 'Email format is not correct' }),
  url: (urlValue) => url(urlValue as SchemaPath<string>),
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

interface Validators {
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
}

interface TextValidators extends Validators {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

interface NumberValidators extends Validators {
  min?: number;
  max?: number;
  step?: number;
}

type ValidatorsForType<T extends FormControlType> = T extends 'text'
  ? TextValidators
  : T extends 'number'
    ? NumberValidators
    : T extends 'select'
      ? Validators
      : Validators;

export function initValidatorsByType<T extends FormControlType>(type: T): ValidatorsForType<T> {
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
      } as ValidatorsForType<T>;

    case 'number':
      return {
        ...baseValidators,
        min: undefined,
        max: undefined,
        step: undefined,
      } as ValidatorsForType<T>;

    default:
      return baseValidators as ValidatorsForType<T>;
  }
}

export interface DynamicFormControl<T extends FormControlType> {
  id: string;
  type: T;
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  hidden?: boolean;
  validators?: ValidatorsForType<T>;
}

export type BasicControlTypes = Extract<
  FormControlType,
  'number' | 'text' | 'email' | 'password' | 'url'
>;
export type BasicControlValueType<T extends BasicControlTypes> = T extends 'number'
  ? number
  : string;

export interface BasicControl<T extends BasicControlTypes = BasicControlTypes>
  extends DynamicFormControl<T> {
  value: BasicControlValueType<T>;
}

export interface SelectControlOption {
  id: string;
  name: string;
}
export type SelectVariantType = 'id' | 'option' | 'multi';
export type SelectControlValueType<T extends SelectVariantType> = T extends 'id'
  ? string
  : T extends 'option'
    ? SelectControlOption
    : SelectControlOption;
export interface SelectControl extends DynamicFormControl<'select'> {
  value: string | SelectControlOption | SelectControlOption[];
  options: SelectControlOption[]; // for select, radio, chips
  variant: 'id' | 'option' | 'multi';
}

type AllBasicControls = {
  [K in BasicControlTypes]: BasicControl<K>;
}[BasicControlTypes];

export type IFormControl = AllBasicControls | SelectControl;

type TextControlType = 'text' | 'email' | 'password' | 'url';
type NumberControlType = 'number';
type SelectControlType = 'select';

// Type predicate for text controls
export const isText = (
  control: IFormControl,
): control is IFormControl & { type: TextControlType } => {
  const types: TextControlType[] = ['text', 'email', 'password', 'url'];
  return types.includes(control.type as TextControlType);
};

// Type predicate for number controls
export const isNumber = (
  control: IFormControl,
): control is IFormControl & { type: NumberControlType } => {
  return control.type === 'number';
};

// Type predicate for select controls
export const isSelect = (
  control: IFormControl,
): control is IFormControl & { type: SelectControlType } => {
  return control.type === 'select';
};
