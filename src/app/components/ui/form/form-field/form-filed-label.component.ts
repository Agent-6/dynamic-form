import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from "@angular/core";
import { NgpLabel } from 'ng-primitives/form-field';

@Component({
  selector: 'ui-form-field-label',
  template: `
    <label ngpLabel>{{ label() }}</label>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NgpLabel],
})
export class FormFieldLabelComponent {
  readonly label = input.required<string>();
}