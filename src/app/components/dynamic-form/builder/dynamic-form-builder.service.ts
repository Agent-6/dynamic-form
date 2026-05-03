import { Injectable, signal } from '@angular/core';
import type { FormControl } from '../../../lib/dynamic-form/types/utils';

@Injectable()
export class DynamicFormService {
  private readonly _controls = signal<FormControl[]>([]);
  public readonly controls = this._controls.asReadonly();

  init(controls: FormControl[]) {
    this._controls.set(controls);
  }

  addControl(control: FormControl) {
    if (this._controls().some((c) => c.id === control.id)) {
      throw new Error(`A control with the id ${control.id} already exists`);
    }

    const notUnique = this._controls().some(
      (c) => c.key.toLocaleLowerCase() === control.key.toLocaleLowerCase(),
    );
    if (notUnique) {
      throw new Error(`A control with the name ${control.key} already exists`);
    }

    this._controls.update((controls) => [...controls, control]);
  }

  removeControl(id: string) {
    this._controls.update((controls) => controls.filter((control) => control.id !== id));
  }

  updateControl(id: string, updatedControl: Partial<FormControl>) {
    const controls = this._controls();
    const control = controls.find((control) => control.id === id);
    if (!control) {
      throw new Error(`No control found with the id ${id}`);
    }

    const rest = controls.filter((control) => control.id !== id);
    if (updatedControl.key && rest.some((c) => c.key === updatedControl.key)) {
      throw new Error(`A control with the name ${updatedControl.key} already exists`);
    }

    this._controls.update(() => {
      return [
        ...rest,
        {
          ...control,
          ...updatedControl,
        } as FormControl,
      ];
    });
  }
}
