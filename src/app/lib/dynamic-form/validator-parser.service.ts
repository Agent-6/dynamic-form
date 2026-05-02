import { Injectable } from '@angular/core';
import {
  disabled,
  hidden,
  readonly,
  required,
  type SchemaPath,
  type FieldTree,
} from '@angular/forms/signals';

export interface ValidatorContext {
  formValue: Record<string, any>;
  fieldValue: any;
  fieldName: string;
}

@Injectable({ providedIn: 'root' })
export class ValidatorParserService {
  /**
   * Parses a DSL expression or returns the literal value.
   * Basic DSL support: "form.value.name === 'test'"
   */
  parse(expression: any, context: ValidatorContext): any {
    if (typeof expression !== 'string') return expression;

    // Very basic "DSL" parser using Function constructor for demonstration.
    // In a production app, a safer expression parser (like JEXL or a custom AST parser) should be used.
    try {
      const fn = new Function('form', 'value', 'name', `return ${expression}`);
      return fn(context.formValue, context.fieldValue, context.fieldName);
    } catch (e) {
      console.warn(`Failed to parse expression: ${expression}`, e);
      return expression;
    }
  }

  /**
   * Applies standard validators based on the provided configuration.
   */
  applyValidators(
    path: SchemaPath<any>,
    validators: Record<string, any> | undefined,
    formValue: () => Record<string, any>,
  ) {
    if (!validators) return;

    const createContext = (): ValidatorContext => ({
      formValue: formValue(),
      fieldValue: (path as any).value(),
      fieldName: (path as any).keyInParent(),
    });

    if (validators['required']) {
      required(path as unknown as any, {
        when: () => !!this.parse(validators['required'], createContext()),
        message: validators['requiredMessage'] || 'Field is required',
      });
    }

    if (validators['disabled']) {
      disabled(path as unknown as any, () => !!this.parse(validators['disabled'], createContext()));
    }

    if (validators['readonly']) {
      readonly(path as unknown as any, () => !!this.parse(validators['readonly'], createContext()));
    }

    if (validators['hidden']) {
      hidden(path as unknown as any, () => !!this.parse(validators['hidden'], createContext()));
    }
  }
}
