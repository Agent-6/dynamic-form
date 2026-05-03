import { FormControlDefinition, Validators } from "../core";

export type RangeMode = 'single' | 'range';
export type RangeValue = number | { from: number; to: number };

export type RangeControl = FormControlDefinition<'range', RangeValue, Validators> & {
  mode: RangeMode;
  min: number;
  max: number;
  step?: number;
};
