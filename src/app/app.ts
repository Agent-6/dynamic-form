import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DynamicFormBuilderComponent } from '@dynamic-form/components/builder/dynamic-form-builder';
import { DynamicFormService } from '@dynamic-form/components/builder/dynamic-form-builder.service';
import { DynamicFormComponent } from '@dynamic-form/components/form/dynamic-form';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DynamicFormComponent, DynamicFormBuilderComponent],
  providers: [DynamicFormService],
})
export class App {
  private readonly service = inject(DynamicFormService);

  protected readonly title = signal('dynamic-form');
  protected readonly controls = this.service.controls;
}
