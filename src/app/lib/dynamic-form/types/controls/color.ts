import { FormControlType, FormControlDefinition } from '../core';

export type ColorControlType = Extract<FormControlType, 'color'>;
export type ColorControl = FormControlDefinition<ColorControlType, string>;
