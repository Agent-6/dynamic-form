import { FieldTree, MaybeFieldTree } from "@angular/forms/signals";
import { FormControlType, IFormControl } from "./dynamic-form.model";

export type ControlByType<T extends FormControlType> = Extract<IFormControl, { type: T }>;

export type ControlValueByType<T extends FormControlType> = ControlByType<T>['value'];

export type ControlsByTypes<T extends readonly FormControlType[]> = Extract<
  IFormControl,
  { type: T[number] }
>;

export type ControlValuesByTypes<T extends readonly FormControlType[]> =
  ControlsByTypes<T>['value'];

export function tryCastControlToType<T extends FormControlType>(
    expectedType: T,
    control: MaybeFieldTree<IFormControl, string>,
  ): FieldTree<ControlValueByType<T>, string> | null {
    if (expectedType === control.type().value()) {
      return control.value as unknown as FieldTree<ControlValueByType<T>, string>;
    }
    return null;
}
