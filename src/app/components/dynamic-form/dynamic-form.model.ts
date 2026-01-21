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
  | 'datetime-local'
  | 'time'
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

export interface DynamicFormControl<T extends FormControlType> {
  id: string;
  type: T;
  name: string;
  label?: string;
  placeholder?: string;
  hidden?: boolean;
  validators?: ValidatorsForType<T>;
}

export type BasicControlTypes = Extract<FormControlType, 'text' | 'number'>;
export type BasicControlValueType<T extends BasicControlTypes> = T extends 'number'
  ? number
  : string;

export interface BasicControl<T extends BasicControlTypes = BasicControlTypes>
  extends DynamicFormControl<T> {
  value: BasicControlValueType<T>;
  options?: never; // options are not applicable to this control type
}

export interface SelectControl extends DynamicFormControl<'select'> {
  value: { id: string; name: string }[];
  options: { id: string; name: string }[]; // for select, radio, chips
}

export type IFormControl = BasicControl<'text'> | BasicControl<'number'> | SelectControl;

export type ControlByType<T extends FormControlType> = Extract<IFormControl, { type: T }>;

export type ControlValueByType<T extends FormControlType> = ControlByType<T>['value'];

export type ControlsByTypes<T extends readonly FormControlType[]> = Extract<
  IFormControl,
  { type: T[number] }
>;

export type ControlValuesByTypes<T extends readonly FormControlType[]> =
  ControlsByTypes<T>['value'];
