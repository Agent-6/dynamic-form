import { FormControlDefinition } from "../core";
import { TextValidators } from "./text";

export type TextareaControl = FormControlDefinition<'textarea', string, TextValidators> & {
  rows?: number;
};
