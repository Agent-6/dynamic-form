import { FormControlDefinition, Validators } from "../core";

export type TimeModeType = 'single' | 'range';
export type TimeFormatType = '12h' | '24h';

export type TimeControlValue = string | [string, string];

export type TimeValidators = Validators & {
  min?: string;
  max?: string;
};

export type TimeControl = FormControlDefinition<
  'time',
  TimeControlValue,
  TimeValidators
> & {
  mode: TimeModeType;
  format: TimeFormatType;
};
