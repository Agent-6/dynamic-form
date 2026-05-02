import {
  applyWhen,
  email,
  type FieldTree,
  type RootFieldContext,
  type SchemaPath,
  type SchemaPathTree,
  validate,
} from '@angular/forms/signals';

export interface SelectControlOption {
  id: string;
  name: string;
}

export type SelectVariantType = 'id' | 'option';

export interface Validators {
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
}

export type TextValidators = Validators & {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
};

export type NumberValidators = Validators & {
  min?: number;
  max?: number;
  step?: number;
};

/**
 * Initially the first thing that needs to be defined is the FormControlType
 * which defines both the type name and the type of that form field's value.
 */
export interface ControlTypeDefinition<TType extends string, TValue, TValidators extends Validators = Validators> {
  readonly type: TType;
  readonly value: TValue;
  readonly validators?: TValidators;
}

/**
 * Source of truth for control type strings.
 */
export const TEXT_CONTROL_TYPES = [
  'text',
  'textarea',
  'email',
  'password',
  'url',
  'tel',
  'search',
  'richtext',
] as const;
export type TextControlType = (typeof TEXT_CONTROL_TYPES)[number];

export const NUMBER_CONTROL_TYPES = ['number'] as const;
export type NumberControlType = (typeof NUMBER_CONTROL_TYPES)[number];

export const SELECT_CONTROL_TYPES = ['select'] as const;
export type SelectControlType = (typeof SELECT_CONTROL_TYPES)[number];

export type TextControlDef = ControlTypeDefinition<TextControlType, string, TextValidators>;

export type NumberControlDef = ControlTypeDefinition<NumberControlType, number, NumberValidators>;

export type SelectControlDef = ControlTypeDefinition<SelectControlType, string | string[] | SelectControlOption | SelectControlOption[], Validators> & {
  options: SelectControlOption[];
  variant: SelectVariantType;
  multi: boolean;
};
export type ColorControlDef = ControlTypeDefinition<'color', string>;

/**
 * Unified FormControlType union of object definitions
 */
export type FormControlType =
  | TextControlDef
  | NumberControlDef
  | SelectControlDef
  | ColorControlDef;

export interface BaseFormControlProps {
  id: string;
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
}

/**
 * IFormControl is the union of all possible form controls, 
 * automatically deriving its value and validators from the FormControlType.
 */
export type IFormControl = BaseFormControlProps & FormControlType;

// Shortcuts for common control types
export type TextControl = BaseFormControlProps & TextControlDef;
export type NumberControl = BaseFormControlProps & NumberControlDef;
export type SelectControl = BaseFormControlProps & SelectControlDef;
export type ColorControl = BaseFormControlProps & ColorControlDef;

/**
 * A discriminated union that "links" a control to its corresponding field tree.
 */
export type DiscriminatedField<T extends IFormControl = IFormControl> = {
  [K in T as K['type']]: {
    control: K;
    field: FieldTree<K['value'], string>;
  }
}[T['type']];

export const isType = <TType extends IFormControl['type']>(
  data: DiscriminatedField,
  ...types: TType[]
): data is Extract<DiscriminatedField, { control: { type: TType } }> => {
  return (types as string[]).includes(data.control.type);
}

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
  ctx: RootFieldContext<IFormControl['value']>,
) => IFormControl | undefined;

/**
 * Applies default validators based on the control type without a registry.
 */
export const applyTypeValidators = (
  path: SchemaPath<IFormControl['value']>,
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

/**
 * Initializes base validators based on the control type.
 */
export function initValidatorsByType(type: IFormControl['type']): Validators {
  const baseValidators: Validators = {
    required: false,
    disabled: false,
    readonly: false,
  };
  
  if ((TEXT_CONTROL_TYPES as readonly string[]).includes(type)) {
    return {
      ...baseValidators,
      minLength: undefined,
      maxLength: undefined,
      pattern: undefined,
    } as TextValidators;
  }

  if ((NUMBER_CONTROL_TYPES as readonly string[]).includes(type)) {
    return {
      ...baseValidators,
      min: undefined,
      max: undefined,
      step: undefined,
    } as NumberValidators;
  }

  return baseValidators;
}
