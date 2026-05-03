import { FormControlDefinition, Validators } from "../core";

export type UploadControl = FormControlDefinition<'upload', File | null, Validators> & {
  accept?: string;
  maxSize?: number;
};
