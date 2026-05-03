import { FormControlType, FormControlDefinition, Validators } from '../core';

export type TextControlType = Extract<FormControlType, 'text' | 'email' | 'url' | 'password'>;
export type TextValidators = Validators & {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
};

export type TextControl = FormControlDefinition<TextControlType, string, TextValidators>;
