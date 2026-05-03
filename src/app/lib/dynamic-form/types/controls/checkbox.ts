import { FormControlDefinition, Validators } from "../core";

export type CheckboxVariant = 'checkbox' | 'toggle';

export type CheckboxControl = FormControlDefinition<'checkbox', boolean, Validators> & {
  variant: CheckboxVariant;
};
