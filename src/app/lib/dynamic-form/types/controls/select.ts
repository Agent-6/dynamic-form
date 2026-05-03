import { FormControlType, FormControlDefinition, Validators } from '../core';

export type SelectControlType = Extract<FormControlType, 'select'>;
export type SelectControlValue = string | string[] | SelectControlOption | SelectControlOption[];
export type SelectVariantType = 'id' | 'option';
export type SelectControlOption = {
  id: string;
  name: string;
}

export type SelectControl = FormControlDefinition<SelectControlType, SelectControlValue, Validators> & {
  options: SelectControlOption[];
  variant: SelectVariantType;
  multi: boolean;
};
