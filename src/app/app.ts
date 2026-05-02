import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DynamicFormBuilderComponent } from './components/dynamic-form/builder/dynamic-form-builder';
import { DynamicFormService } from './components/dynamic-form/builder/dynamic-form-builder.service';
import type { IFormControl } from './components/dynamic-form/dynamic-form.model';
import { DynamicFormComponent } from './components/dynamic-form/form/dynamic-form';
import { FormFieldRendererComponent } from './components/dynamic-form/form-field-renderer';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DynamicFormComponent, DynamicFormBuilderComponent, FormFieldRendererComponent],
  providers: [DynamicFormService],
})
export class App {
  private readonly service = inject(DynamicFormService);

  protected readonly title = signal('dynamic-form');
  protected readonly controls = this.service.controls;
}
