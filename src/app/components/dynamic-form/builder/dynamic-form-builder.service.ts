import { Injectable, signal } from '@angular/core';
import type { IFormControl } from '../dynamic-form.model';

@Injectable()
export class DynamicFormService {
  private readonly _controls = signal<IFormControl[]>([]);
  public readonly controls = this._controls.asReadonly();

  init(controls: IFormControl[]) {
    this._controls.set(controls);
  }

  addControl(control: IFormControl) {
    if (this._controls().some((c) => c.id === control.id)) {
      throw new Error(`A control with the id ${control.id} already exists`);
    }

    const notUnique = this._controls().some(
      (c) => c.name.toLocaleLowerCase() === control.name.toLocaleLowerCase(),
    );
    if (notUnique) {
      throw new Error(`A control with the name ${control.name} already exists`);
    }

    this._controls.update((controls) => [...controls, control]);
  }

  removeControl(id: string) {
    this._controls.update((controls) => controls.filter((control) => control.id !== id));
  }

  updateControl(id: string, updatedControl: Partial<IFormControl>) {
    const controls = this._controls();
    const control = controls.find((control) => control.id === id);
    if (!control) {
      throw new Error(`No control found with the id ${id}`);
    }

    const rest = controls.filter((control) => control.id !== id);
    if (updatedControl.name && rest.some((c) => c.name === updatedControl.name)) {
      throw new Error(`A control with the name ${updatedControl.name} already exists`);
    }

    this._controls.update(() => {
      return [
        ...rest,
        {
          ...control,
          ...updatedControl,
        } as IFormControl,
      ];
    });
  }
}
