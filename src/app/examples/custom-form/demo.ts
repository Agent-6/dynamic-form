import { JsonPipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { DYNAMIC_FORM_REGISTRY, type LibraryRegistry, type BaseFieldConfig } from '../../lib/dynamic-form/types';
import { DynamicFormCoreComponent } from '../../lib/dynamic-form/dynamic-form-core.component';
import { CustomInputComponent, CustomToggleComponent } from './fields';

export const EXAMPLE_REGISTRY: LibraryRegistry<'text' | 'email' | 'toggle'> = {
  text: { component: CustomInputComponent, valueType: '' },
  email: { component: CustomInputComponent, valueType: '' },
  toggle: { component: CustomToggleComponent, valueType: false },
};

@Component({
  selector: 'app-library-demo',
  standalone: true,
  imports: [DynamicFormCoreComponent, JsonPipe],
  providers: [
    { provide: DYNAMIC_FORM_REGISTRY, useValue: EXAMPLE_REGISTRY }
  ],
  template: `
    <div class="demo-container">
      <h2>Library-First Dynamic Form Demo</h2>
      <p>This form uses a DSL for conditional validation.</p>
      
      <lib-dynamic-form [controls]="formConfig()" #form />
      
      <button (click)="form.submit()" style="margin-top: 1rem;">Submit Form</button>
      
      <div class="debug">
        <h4>Live State:</h4>
        <pre>{{ form.form().value() | json }}</pre>
        <h4>Validity:</h4>
        <pre>{{ form.form().valid() ? 'Valid' : 'Invalid' }}</pre>
      </div>
    </div>
  `,
  styles: `
    .demo-container { padding: 2rem; border: 1px solid #ccc; border-radius: 8px; max-width: 500px; }
    .debug { margin-top: 2rem; padding: 1rem; background: #f0f0f0; border-radius: 4px; font-family: monospace; }
  `
})
export class LibraryDemoComponent {
  readonly formConfig = signal<BaseFieldConfig<any, any>[]>([
    {
      id: 'f1',
      type: 'text',
      name: 'firstName',
      label: 'First Name',
      value: '',
      validators: {
        required: 'true'
      }
    },
    {
      id: 'f2',
      type: 'toggle',
      name: 'subscribe',
      label: 'Subscribe to newsletter?',
      value: false
    },
    {
      id: 'f3',
      type: 'email',
      name: 'email',
      label: 'Email Address',
      value: '',
      validators: {
        required: 'form.subscribe === true',
        requiredMessage: 'Email is required if you subscribe'
      }
    }
  ]);
}
