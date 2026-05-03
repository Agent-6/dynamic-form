export type FormControlType =
  | 'text'
  | 'email'
  | 'url'
  | 'password'
  | 'number'
  | 'select'
  | 'color'
  | 'date'
  | 'time'
  ;

export type Validators = {
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  hidden?: boolean;
}

export type FormControlDefinition<TType extends FormControlType, TValue, TValidators extends Validators = Validators> = {
  id: string;
  type: TType;
  key: string;
  label?: string;
  description?: string;
  placeholder?: string;
  value: TValue;
  validators?: TValidators;
}
