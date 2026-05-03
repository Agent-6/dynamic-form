import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import type { TimeControlValue, TimeFormatType, TimeModeType } from '@dynamic-form/types/controls/time';
import { FormFieldComponent } from '../form/form-field/form-field.component';
import {
  FormFieldControl,
  FormFieldStateService,
} from '../form/form-field/form-field-control.component';

@Component({
  selector: 'ui-time',
  templateUrl: './time.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormFieldComponent],
  providers: [FormFieldStateService],
})
export class TimeComponent extends FormFieldControl<TimeControlValue> {
  public readonly mode = input.required<TimeModeType>();
  public readonly format = input.required<TimeFormatType>();
  public readonly minTime = input<string | undefined>();
  public readonly maxTime = input<string | undefined>();

  protected onInput(event: Event, index?: number) {
    const val = (event.target as HTMLInputElement).value;
    if (this.mode() === 'single') {
      this.value.set(val);
    } else {
      const current = (this.value() as [string, string]) || ['', ''];
      if (index === 0) {
        this.value.set([val, current[1]]);
      } else {
        this.value.set([current[0], val]);
      }
    }
  }

  protected getSingleValue(): string {
    return (this.value() as string) || '';
  }

  protected getRangeValue(index: number): string {
    const val = this.value() as [string, string];
    return val ? val[index] : '';
  }
}
