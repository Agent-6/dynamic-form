import { applyWhen, email, RootFieldContext, SchemaPath, SchemaPathTree, validate } from "@angular/forms/signals";
import { Validators } from "./core";
import { FormControl } from "./utils";
import { DateControl, DateControlValue } from "./controls/date";
import { TimeControl, TimeControlValue } from "./controls/time";

/**
 * Default type-specific validators defined as standalone functions.
 * These are applied automatically based on the control type.
 */
export const emailValidator = (field: SchemaPathTree<string>) =>
  email(field, { message: 'Email format is not correct' });

export const urlValidator = (field: SchemaPathTree<string>) => {
  validate(field, ({ value }) => {
    try {
      const val = value();
      if (val) {
        new URL(val);
      }
      return null;
    } catch {
      return { kind: 'url', message: 'URL format is not correct' };
    }
  });
};

export const dateValidator = (field: SchemaPathTree<DateControlValue>, getControl: getControlFormContext) => {
  validate(field, (ctx) => {
    const control = getControl(ctx) as DateControl;
    const value = ctx.value();
    if (!value) return null;

    // 1. Min/Max Validation
    const min = control.validators?.min;
    const max = control.validators?.max;
    const checkMinMax = (d: string) => {
      if (!d) return null;
      if (min && new Date(d) < new Date(min)) return { kind: 'minDate', message: `Date must be after ${min}` };
      if (max && new Date(d) > new Date(max)) return { kind: 'maxDate', message: `Date must be before ${max}` };
      return null;
    };

    const minMaxError = Array.isArray(value) ? checkMinMax(value[0]) || checkMinMax(value[1]) : checkMinMax(value as string);
    if (minMaxError) return minMaxError;

    // 2. Range Validation
    if (control.mode === 'range' && Array.isArray(value) && value[0] && value[1]) {
      const from = new Date(value[0]);
      const to = new Date(value[1]);
      if (to < from) return { kind: 'dateRange', message: '"To" date must be after "From" date' };
    }

    // 3. Year Depth Validation
    if (control.depth === 'year') {
      const checkYear = (s: string) => {
        if (!s) return null;
        const year = parseInt(s, 10);
        const minYear = 1900;
        const maxYear = new Date().getFullYear();
        if (isNaN(year) || s.length !== 4) return { kind: 'yearFormat', message: 'Year must be 4 digits' };
        if (year < minYear || year > maxYear) return { kind: 'yearRange', message: `Year must be between ${minYear} and ${maxYear}` };
        return null;
      };
      const yearError = Array.isArray(value) ? checkYear(value[0]) || checkYear(value[1]) : checkYear(value as string);
      if (yearError) return yearError;
    }

    return null;
  });
};

export const timeValidator = (field: SchemaPathTree<TimeControlValue>, getControl: getControlFormContext) => {
  validate(field, (ctx) => {
    const control = getControl(ctx) as TimeControl;
    const value = ctx.value();
    if (!value) return null;

    // 1. Min/Max Validation
    const min = control.validators?.min;
    const max = control.validators?.max;
    const checkMinMax = (t: string) => {
      if (!t) return null;
      if (min && t < min) return { kind: 'minTime', message: `Time must be after ${min}` };
      if (max && t > max) return { kind: 'maxTime', message: `Time must be before ${max}` };
      return null;
    };

    const minMaxError = Array.isArray(value) ? checkMinMax(value[0]) || checkMinMax(value[1]) : checkMinMax(value as string);
    if (minMaxError) return minMaxError;

    // 2. Range Validation (To > From)
    if (control.mode === 'range' && Array.isArray(value) && value[0] && value[1]) {
      if (value[1] < value[0]) return { kind: 'timeRange', message: '"To" time must be after "From" time' };
    }

    return null;
  });
};

export type getControlFormContext = (
  ctx: RootFieldContext<FormControl['value']>,
) => FormControl | undefined;

/**
 * Applies default validators based on the control type without a registry.
 */
export const applyTypeValidators = (
  path: SchemaPath<FormControl['value']>,
  getControl: getControlFormContext,
) => {
  // Apply email validator if type is 'email'
  applyWhen<string>(
    path as SchemaPath<string>,
    (ctx) => getControl(ctx)?.type === 'email' && !!ctx.value(),
    emailValidator
  );

  // Apply url validator if type is 'url'
  applyWhen<string>(
    path as SchemaPath<string>,
    (ctx) => getControl(ctx)?.type === 'url' && !!ctx.value(),
    urlValidator
  );

  // Date validation (Range, Year, and Min/Max)
  applyWhen<DateControlValue>(
    path as SchemaPath<DateControlValue>,
    (ctx) => getControl(ctx)?.type === 'date',
    (field) => {
      dateValidator(field, getControl);
    }
  );

  // Time validation (Range and Min/Max)
  applyWhen<TimeControlValue>(
    path as SchemaPath<TimeControlValue>,
    (ctx) => getControl(ctx)?.type === 'time',
    (field) => {
      timeValidator(field, getControl);
    }
  );
};

const baseValidators: Validators = {
  required: false,
  disabled: false,
  readonly: false,
  hidden: false,
};

export function initValidatorsByType<TFormControl extends FormControl>(type: TFormControl['type']): TFormControl['validators'] {
  if (['text', 'email', 'url', 'password'].includes(type)) {
    return {
      ...baseValidators,
      minLength: undefined,
      maxLength: undefined,
      pattern: undefined,
    };
  }

  if (type === 'date') {
    return {
      ...baseValidators,
      min: '',
      max: '',
    };
  }

  if (type === 'time') {
    return {
      ...baseValidators,
      min: '',
      max: '',
    };
  }

  if (type === 'number') {
    return {
      ...baseValidators,
      min: undefined,
      max: undefined,
      step: undefined,
    };
  }

  return baseValidators;
}
