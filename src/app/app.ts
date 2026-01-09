import { ChangeDetectionStrategy, Component, signal, ViewEncapsulation } from '@angular/core';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DynamicFormComponent],
})
export class App {
  protected readonly title = signal('dynamic-form');
}
