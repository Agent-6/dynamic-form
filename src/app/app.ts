import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { DynamicFormBuilderComponent } from './components/dynamic-form/builder/dynamic-form-builder';
import type { IFormControl } from './components/dynamic-form/dynamic-form.model';
import { DynamicFormComponent } from './components/dynamic-form/form/dynamic-form';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DynamicFormComponent, DynamicFormBuilderComponent],
})
export class App {
  protected readonly title = signal('dynamic-form');
  protected readonly controls = signal<IFormControl[]>([]);

  setControls = (controls: IFormControl[]) => this.controls.set(controls);
}
