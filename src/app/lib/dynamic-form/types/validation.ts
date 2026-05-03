
import { applyWhen, email, RootFieldContext, SchemaPath, SchemaPathTree, validate } from "@angular/forms/signals";
import { Validators } from "./core";
import { FormControl } from "./utils";

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
      step: undefined,
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
