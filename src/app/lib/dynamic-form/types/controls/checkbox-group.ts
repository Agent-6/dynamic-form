import { FormControlDefinition, Validators } from "../core";
import { SelectControlOption } from "./select";
import { CheckboxVariant } from "./checkbox";

export type CheckboxGroupControl = FormControlDefinition<'checkbox-group', string[], Validators> & {
  options: SelectControlOption[];
  variant: CheckboxVariant;
};
