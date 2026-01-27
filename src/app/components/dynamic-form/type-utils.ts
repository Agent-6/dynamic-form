import type { FormControlType, IFormControl } from './dynamic-form.model';

export type ControlByType<T extends FormControlType> = Extract<IFormControl, { type: T }>;

export type ControlValueByType<T extends FormControlType> = ControlByType<T>['value'];

export type ControlsByTypes<T extends readonly FormControlType[]> = Extract<
  IFormControl,
  { type: T[number] }
>;

export type ControlValuesByTypes<T extends readonly FormControlType[]> =
  ControlsByTypes<T>['value'];
