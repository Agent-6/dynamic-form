import { FormControlType, FormControlDefinition, Validators } from '../core';

export type NumberControlType = Extract<FormControlType, 'number'>;
export type NumberValidators = Validators & {
  min?: number;
  max?: number;
  step?: number;
};

export type NumberControl = FormControlDefinition<NumberControlType, number, NumberValidators>;
