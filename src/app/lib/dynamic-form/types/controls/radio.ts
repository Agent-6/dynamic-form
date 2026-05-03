import { FormControlDefinition, Validators } from "../core";
import { SelectControlOption } from "./select";

export type RadioControl = FormControlDefinition<'radio', string, Validators> & {
  options: SelectControlOption[];
};
