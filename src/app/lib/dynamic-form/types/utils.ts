import { type FieldTree } from '@angular/forms/signals';
import { FormControlType } from './core';
import { SelectControl } from './controls/select';
import { TextControl } from './controls/text';
import { NumberControl } from './controls/number';
import { ColorControl } from './controls/color';
import { DateControl } from './controls/date';
import { TimeControl } from './controls/time';
import { TextareaControl } from './controls/textarea';
import { CheckboxControl } from './controls/checkbox';
import { RadioControl } from './controls/radio';

// Union of all controls
export type FormControl = SelectControl | TextControl | NumberControl | ColorControl | DateControl | TimeControl | TextareaControl | CheckboxControl | RadioControl;

/**
 * A discriminated union that "links" a control to its corresponding field tree.
 */
export type DiscriminatedField<T extends FormControl = FormControl> = {
  [K in T as K['type']]: {
    control: K;
    field: FieldTree<K['value'], string>;
  }
}[T['type']];

export const isType = <TType extends FormControlType>(
  data: DiscriminatedField,
  ...types: TType[]
): data is Extract<DiscriminatedField, { control: { type: TType } }> => {
  return (types as string[]).includes(data.control.type);
};

