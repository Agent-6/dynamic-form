import { Component, input } from '@angular/core';
import { type FieldTree } from '@angular/forms/signals';
import { AbstractFormField, type BaseFieldConfig } from '../../lib/dynamic-form/types';

export interface CustomTextConfig extends BaseFieldConfig<'text' | 'email' | 'password', string> {
  minLength?: number;
  maxLength?: number;
}

@Component({
  selector: 'app-custom-input',
  standalone: true,
  template: `
    <div class="custom-field">
      <label [for]="config().id">{{ config().label }}</label>
      <input
        [id]="config().id"
        [type]="config().type"
        [placeholder]="config().placeholder || ''"
        [value]="fieldTree()().value()"
        (input)="fieldTree()().value.set($any($event.target).value)"
        [disabled]="fieldTree()().disabled()"
        [readonly]="fieldTree()().readonly()"
        [class.invalid]="fieldTree()().invalid()"
      />
      @if (fieldTree()().invalid()) {
        <div class="errors">
          @for (error of fieldTree()().errors(); track $index) {
            <span>{{ error.message }}</span>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .custom-field { display: flex; flex-direction: column; gap: 0.25rem; }
    input.invalid { border-color: red; }
    .errors { color: red; font-size: 0.8rem; }
  `
})
export class CustomInputComponent extends AbstractFormField<CustomTextConfig> {
  config = input.required<CustomTextConfig>();
  fieldTree = input.required<any>(); // Using any to bypass complex CompatFieldState issues
}

export interface CustomToggleConfig extends BaseFieldConfig<'toggle', boolean> {}

@Component({
  selector: 'app-custom-toggle',
  standalone: true,
  template: `
    <div class="custom-field toggle">
      <label>
        <input
          type="checkbox"
          [checked]="fieldTree()().value()"
          (change)="fieldTree()().value.set($any($event.target).checked)"
          [disabled]="fieldTree()().disabled()"
        />
        {{ config().label }}
      </label>
    </div>
  `,
  styles: `
    .toggle { flex-direction: row; align-items: center; }
  `
})
export class CustomToggleComponent extends AbstractFormField<CustomToggleConfig> {
  config = input.required<CustomToggleConfig>();
  fieldTree = input.required<any>(); // Using any to bypass complex CompatFieldState issues
}
