// import { InjectionToken, inject, type Provider, type Signal, type Type } from '@angular/core';
// import type { FieldTree } from '@angular/forms/signals';
// import { InputComponent } from '../ui/input/input.component';

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

// // export type Config<TValue, TExtra extends object = {}> = BaseConfig<TValue> & TExtra;

// export abstract class FormField<TValue, TConfig extends BaseConfig<TValue>> {
//   abstract formField: Signal<FieldTree<TValue, string | number>>;
//   abstract config: Signal<TConfig>;
// }

// export interface ControlDefinition<
//   TType extends string,
//   TValue,
//   TConfig extends BaseConfig<TValue>,
// > {
//   type: TType;
//   component: Type<FormField<TValue, TConfig>>;
//   config: TConfig;
// }

// export type ControlMap = {
//   [K in string]: ControlDefinition<K, any, any>;
// };

// export class FormBuilder<TControls extends ControlMap> {
//   private registry = inject(CONTROL_MAP) as TControls;

//   register<K extends keyof TControls>(type: K, control: TControls[K]) {
//     this.registry[type] = control;
//   }

//   get<K extends keyof TControls>(type: K): TControls[K] {
//     const control = this.registry[type];
//     if (!control) {
//       throw new Error(`Control ${String(type)} not registered`);
//     }
//     return control;
//   }
// }

// interface TextConfig extends BaseConfig<string> {
//   minLength?: number;
//   maxLength?: number;
// }

// interface SelectConfig extends BaseConfig<string> {
//   options: { id: string; name: string }[];
//   variant: 'id' | 'option';
//   multi: boolean;
// }

// type FieldControls = {
//   text: ControlDefinition<'text', string, TextConfig>;
//   select: ControlDefinition<'select', string, SelectConfig>;
// };

// export const formBuilder = new FormBuilder<FieldControls>();

// formBuilder.register('select', {
//   type: 'select',
//   component: InputComponent as unknown as Type<FormField<string, SelectConfig>>,
//   config: {
//     label: 'Select Field',
//     value: '',
//     placeholder: 'Enter text',
//     validators: {
//       required: (value: string) => value.length > 0,
//     },
//     options: [
//       { id: '1', name: 'Option 1' },
//       { id: '2', name: 'Option 2' },
//     ],
//     variant: 'id',
//     multi: false,
//   },
// });

// // export type ControlMap = Record<string, ControlDefinition<any, any, any>>;

// export const CONTROL_MAP = new InjectionToken<ControlMap>('CONTROL_MAP');

// export function provideControlMap<TControls extends ControlMap>(controls: TControls): Provider {
//   return {
//     provide: CONTROL_MAP,
//     useValue: controls,
//   };
// }

// // const t = provideControlMap<FieldControls>({});
