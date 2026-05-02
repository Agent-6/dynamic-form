import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  linkedSignal,
  ViewEncapsulation,
} from '@angular/core';
import {
  applyEach,
  form,
  schema,
  type FieldTree,
} from '@angular/forms/signals';
import { DYNAMIC_FORM_REGISTRY, type BaseFieldConfig } from './types';
import { ValidatorParserService } from './validator-parser.service';

@Component({
  selector: 'lib-dynamic-form',
  standalone: true,
  imports: [NgComponentOutlet],
  template: `
    <div class="dynamic-form-container">
      @for (config of controls(); track config.id) {
        <div class="field-wrapper">
          <ng-container
            [ngComponentOutlet]="getComponent(config.type)"
            [ngComponentOutletInputs]="{
              config: config,
              fieldTree: getFieldTree(config.name)
            }"
          />
        </div>
      }
    </div>
  `,
  styles: `
    .dynamic-form-container { display: flex; flex-direction: column; gap: 1rem; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DynamicFormCoreComponent {
  controls = input.required<BaseFieldConfig<string, any>[]>();
  
  private readonly registry = inject(DYNAMIC_FORM_REGISTRY);
  private readonly validatorService = inject(ValidatorParserService);

  /**
   * Initial state of the form derived from controls.
   */
  readonly formState = linkedSignal(() => {
    const state: Record<string, any> = {};
    for (const control of this.controls()) {
      state[control.name] = control.value;
    }
    return state;
  });

  /**
   * Dynamic schema that applies validators based on the DSL in each control config.
   */
  private readonly fieldSchema = schema<any>((path) => {
    const controlName = (path as any).keyInParent();
    const config = this.controls().find(c => c.name === controlName);
    
    if (config) {
      this.validatorService.applyValidators(path as unknown as any, config.validators, this.formState);
    }
  });

  /**
   * The actual Angular Signal Form.
   */
  readonly form = form(this.formState, (f) => {
    applyEach(f, this.fieldSchema);
  });

  /**
   * Resolves the component type for a given control type from the registry.
   */
  getComponent(type: string) {
    const definition = this.registry[type];
    if (!definition) {
      throw new Error(`Field type "${type}" is not registered in DYNAMIC_FORM_REGISTRY.`);
    }
    return definition.component;
  }

  /**
   * Gets the FieldTree for a specific control name from the form.
   */
  getFieldTree(name: string): FieldTree<any, any> {
    return (this.form as any)[name];
  }

  /**
   * Public method to submit the form.
   */
  submit() {
    if (this.form().valid()) {
      console.log('Form Submitted:', this.form().value());
      return this.form().value();
    } else {
      console.warn('Form is invalid');
      return null;
    }
  }
}
