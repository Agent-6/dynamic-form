import { FormControlType, FormControlDefinition, Validators } from '../core';

export type DateControlType = Extract<FormControlType, 'date'>;
export type DateControlValue = string | [string, string];
export type DateDepthType = 'day' | 'week' | 'year';
export type DateModeType = 'single' | 'range';

export type DateValidators = Validators & {
  min?: string;
  max?: string;
};

export type DateControl = FormControlDefinition<DateControlType, DateControlValue, DateValidators> & {
  depth: DateDepthType;
  mode: DateModeType;
};
