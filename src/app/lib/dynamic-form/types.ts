import { InjectionToken, type Type } from '@angular/core';
import { type FieldTree } from '@angular/forms/signals';

/**
 * Base configuration for any field in the dynamic form.
 * TType: A string literal representing the control type.
 * TValue: The type of the value this control manages.
 */
export interface BaseFieldConfig<TType extends string, TValue> {
  id: string;
  type: TType;
  name: string;
  label?: string;
  description?: string;
  placeholder?: string;
  value: TValue;
  validators?: Record<string, any>;
  meta?: Record<string, any>;
}

/**
 * Abstract class that all custom field components must extend.
 */
export abstract class AbstractFormField<TConfig extends BaseFieldConfig<string, any>> {
  abstract config: { (): TConfig };
  abstract fieldTree: { (): any };
}

/**
 * Definition of a field type, mapping it to a component and default behavior.
 */
export interface FieldTypeDefinition<
  TType extends string,
  TValue,
  TConfig extends BaseFieldConfig<TType, TValue>,
> {
  component: Type<AbstractFormField<TConfig>>;
  valueType: TValue;
}

/**
 * Registry of all supported field types in a specific application.
 */
export type LibraryRegistry<TTypes extends string> = {
  [K in TTypes]: FieldTypeDefinition<K, any, any>;
};

/**
 * DI Token for providing the field registry.
 */
export const DYNAMIC_FORM_REGISTRY = new InjectionToken<LibraryRegistry<string>>(
  'DYNAMIC_FORM_REGISTRY',
);
