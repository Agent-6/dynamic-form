export type FormControlType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'url'
  | 'password'
  | 'number'
  | 'select'
  | 'color'
  | 'date'
  | 'time'
  | 'checkbox'
  | 'radio'
  | 'checkbox-group'
  | 'range'
  | 'upload'
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
