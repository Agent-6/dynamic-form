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
  description?: string;
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
  variant?: never;
}

export interface SelectControlOption {
  id: string;
  name: string;
}
export type SelectControlType = 'id' | 'option' | 'multi';
export type SelectControlValueType<T extends SelectControlType> = T extends 'id'
  ? string
  : T extends 'option'
    ? SelectControlOption
    : SelectControlOption;
export interface SelectControl extends DynamicFormControl<'select'> {
  value: string | SelectControlOption | SelectControlOption[];
  options: SelectControlOption[]; // for select, radio, chips
  variant: 'id' | 'option' | 'multi';
}

export type IFormControl = BasicControl<'text'> | BasicControl<'number'> | SelectControl;
