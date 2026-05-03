import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import type { DateControlValue, DateDepthType, DateModeType } from '@dynamic-form/types/controls/date';
import { FormFieldComponent } from '../form/form-field/form-field.component';
import {
  FormFieldControl,
  FormFieldStateService,
} from '../form/form-field/form-field-control.component';

@Component({
  selector: 'ui-date',
  templateUrl: './date.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormFieldComponent],
  providers: [FormFieldStateService],
})
export class DateComponent extends FormFieldControl<DateControlValue> {
  public readonly depth = input.required<DateDepthType>();
  public readonly mode = input.required<DateModeType>();
  public readonly minDate = input<string | undefined>();
  public readonly maxDate = input<string | undefined>();

  protected getMin(): string | undefined {
    if (this.depth() === 'year' && !this.minDate()) return '1900';
    return this.minDate();
  }

  protected getMax(): string | undefined {
    if (this.depth() === 'year' && !this.maxDate()) return new Date().getFullYear().toString();
    return this.maxDate();
  }

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

  protected getNativeType(): string {
    switch (this.depth()) {
      case 'week': return 'week';
      case 'year': return 'text'; 
      default: return 'date';
    }
  }
}
