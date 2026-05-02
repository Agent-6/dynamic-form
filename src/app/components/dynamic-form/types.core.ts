// import { JsonPipe, NgComponentOutlet } from '@angular/common';
// import { Component, InjectionToken, inject, input, type Provider, type Type } from '@angular/core';
// import type { FieldTree } from '@angular/forms/signals';

// // ============================================================================
// // Base Types (unchanged)
// // ============================================================================

// export type ValidatorFunction<T> = (value: T) => boolean;

// export type Validators<T> = {
//   disabled?: boolean | ValidatorFunction<T>;
//   readonly?: boolean | ValidatorFunction<T>;
//   required?: boolean | ValidatorFunction<T>;
//   hidden?: boolean | ValidatorFunction<T>;
// };

// export interface BaseConfig<TValue> {
//   label: string;
//   description?: string;
//   placeholder?: string;
//   value: TValue;
//   validators?: Validators<TValue>;
// }

// // ============================================================================
// // Abstract Form Field Component (unchanged)
// // ============================================================================

// @Component({
//   template: '',
// })
// export abstract class FormFieldComponent<
//   TConfig extends BaseConfig<TValue>,
//   TValue = TConfig['value'],
// > {
//   formField = input.required<FieldTree<TValue, string | number>>();
//   config = input.required<TConfig>();
// }

// // ============================================================================
// // Type-Safe Component Registry
// // ============================================================================

// export type ComponentRegistry<TFieldTypes extends string> = {
//   [K in TFieldTypes]: Type<FormFieldComponent<any, any>>;
// };

// export type CompleteComponentRegistry<TFieldTypes extends string> = Required<
//   ComponentRegistry<TFieldTypes>
// >;

// // ============================================================================
// // Config Extraction and Field Config Types
// // ============================================================================

// type ExtractConfigType<T> = T extends Type<FormFieldComponent<infer TConfig>> ? TConfig : never;

// type ExtractValueType<T> =
//   T extends Type<FormFieldComponent<infer _TConfig, infer TValue>> ? TValue : never;

// /**
//  * Creates a discriminated union of field configs
//  */
// export type FieldConfig<
//   TFieldTypes extends string,
//   TRegistry extends ComponentRegistry<TFieldTypes>,
// > = {
//   [K in TFieldTypes]: { type: K } & ExtractConfigType<TRegistry[K]>;
// }[TFieldTypes];

// /**
//  * Type guard to check if a field config is of a specific type
//  */
// export function isFieldType<
//   TFieldTypes extends string,
//   TRegistry extends ComponentRegistry<TFieldTypes>,
//   K extends TFieldTypes,
// >(
//   config: FieldConfig<TFieldTypes, TRegistry>,
//   type: K,
// ): config is ExtractConfigType<TRegistry[K]> & { type: K } {
//   return config.type === type;
// }

// // ============================================================================
// // Generic DynamicFormComponent
// // ============================================================================

// /**
//  * Generic form component that works with any set of field types
//  */
// @Component({
//   selector: 'app-dynamic-form',
//   template: `
//     <div>Dynamic Form</div>
//     <div>
//       <h4>Controls</h4>
//       <ul>
//         @for (control of controls(); track $index) {
//           <li>{{ control.label }}</li>
//           <ng-container
//             [ngComponentOutlet]="getComponentForType(control.type)"
//             [ngComponentOutletInputs]="{
//               formField: getFormFieldForControl(control),
//               config: control
//             }"
//           />
//         }
//       </ul>
//     </div>
//   `,
//   imports: [NgComponentOutlet],
//   standalone: true,
// })
// export class DynamicFormComponent<
//   TFieldTypes extends string,
//   TRegistry extends CompleteComponentRegistry<TFieldTypes>,
//   TFieldConfig extends FieldConfig<TFieldTypes, TRegistry> = FieldConfig<TFieldTypes, TRegistry>,
// > {
//   readonly controls = input.required<TFieldConfig[]>();

//   // Inject the registry - will be provided by parent component/module
//   registry = inject<TRegistry>(FORM_FIELDS_REGISTRY);

//   /**
//    * Get the component for a specific field type
//    */
//   getComponentForType<TType extends TFieldTypes>(type: TType): TRegistry[TType] {
//     return this.registry[type];
//   }

//   /**
//    * Mock form field creation (in real app, this would come from a form service)
//    */
//   getFormFieldForControl(control: TFieldConfig): FieldTree<any, string | number> {
//     // This is a simplified example - in reality, you'd create proper FieldTree objects
//     return {} as FieldTree<any, string | number>;
//   }
// }

// // ============================================================================
// // DI Token and Provider Function
// // ============================================================================

// export const FORM_FIELDS_REGISTRY = new InjectionToken<CompleteComponentRegistry<any>>(
//   'FORM_FIELDS_REGISTRY',
// );

// export function provideFormFieldsRegistry<
//   TFieldTypes extends string,
//   TRegistry extends CompleteComponentRegistry<TFieldTypes>,
// >(registry: TRegistry): Provider {
//   return {
//     provide: FORM_FIELDS_REGISTRY,
//     useValue: registry,
//     multi: true,
//   };
// }

// // ============================================================================
// // Example: Library's Default Field Types
// // ============================================================================

// // Library's base field types
// interface TextConfig extends BaseConfig<string> {
//   minLength?: number;
//   maxLength?: number;
// }

// interface NumberConfig extends BaseConfig<number> {
//   min?: number;
//   max?: number;
//   step?: number;
// }

// interface SelectConfig extends BaseConfig<string> {
//   options: Array<{ label: string; value: string }>;
// }

// // Library's default components
// @Component({
//   template: `
//     <p>Text Field: {{config().label}}</p>
//     <div>Value: {{config().value}}</div>
//     <div>Min: {{config().minLength}}</div>
//     <div>Max: {{config().maxLength}}</div>
//   `,
//   standalone: true,
// })
// export class TextFieldComponent extends FormFieldComponent<TextConfig> {}

// @Component({
//   template: `
//     <p>Number Field: {{config().label}}</p>
//     <div>Value: {{config().value}}</div>
//     <div>Min: {{config().min}}</div>
//     <div>Max: {{config().max}}</div>
//   `,
//   standalone: true,
// })
// export class NumberFieldComponent extends FormFieldComponent<NumberConfig> {}

// @Component({
//   template: `
//     <p>Select Field: {{config().label}}</p>
//     <div>Value: {{config().value}}</div>
//     <div>Options: {{config().options | json}}</div>
//   `,
//   imports: [JsonPipe],
//   standalone: true,
// })
// export class SelectFieldComponent extends FormFieldComponent<SelectConfig> {}

// @Component({
//   template: `
//     <p>Select Field: {{config().label}}</p>
//     <div>Value: {{config().value}}</div>
//     <div>Options: {{config().options | json}}</div>
//   `,
//   imports: [JsonPipe],
//   standalone: true,
// })
// export class DynamicFieldComponent extends FormFieldComponent<ConfigUnion> {}

// export type FiledTypes = 'text' | 'number' | 'select';

// // Library's default registry
// export const DefaultFieldComponentRegistry = {
//   text: TextFieldComponent,
//   number: NumberFieldComponent,
//   select: SelectFieldComponent,
// } satisfies ComponentRegistry<FiledTypes>;

// export type RegistryType = typeof DefaultFieldComponentRegistry;
// export type DefaultFieldConfig = FieldConfig<FiledTypes, typeof DefaultFieldComponentRegistry>;
// type ExtractConfig<T> = T extends { type: infer Type }
//   ? { [P in Exclude<keyof T, 'type'>]: T[P] }
//   : never;

// type ConfigUnion = ExtractConfig<DefaultFieldConfig>;
