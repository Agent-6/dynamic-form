import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import type { RangeMode, RangeValue } from '@dynamic-form/types/controls/range';
import { FormFieldComponent } from '../form/form-field/form-field.component';
import {
  FormFieldControl,
  FormFieldStateService,
} from '../form/form-field/form-field-control.component';

@Component({
  selector: 'ui-range',
  templateUrl: './range.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormFieldComponent],
  providers: [FormFieldStateService],
})
export class RangeComponent extends FormFieldControl<RangeValue> {
  public readonly mode = input<RangeMode>('single');
  public readonly minVal = input<number>(0);
  public readonly maxVal = input<number>(100);
  public readonly step = input<number>(1);

  protected get from(): number {
    const val = this.value();
    if (this.mode() === 'single') return typeof val === 'number' ? val : this.minVal();
    return typeof val === 'object' && val !== null ? val.from : this.minVal();
  }

  protected get to(): number {
    const val = this.value();
    if (this.mode() === 'single') return this.maxVal();
    return typeof val === 'object' && val !== null ? val.to : this.maxVal();
  }

  protected get fromPercent(): number {
    const min = this.minVal();
    const max = this.maxVal();
    return ((this.from - min) / (max - min)) * 100;
  }

  protected get toPercent(): number {
    const min = this.minVal();
    const max = this.maxVal();
    return ((this.to - min) / (max - min)) * 100;
  }

  protected onSingleChange(val: number) {
    this.value.set(val);
  }

  protected onFromChange(val: number) {
    const currentTo = this.to;
    const newFrom = Math.min(val, currentTo);
    this.value.set({ from: newFrom, to: currentTo });
  }

  protected onToChange(val: number) {
    const currentFrom = this.from;
    const newTo = Math.max(val, currentFrom);
    this.value.set({ from: currentFrom, to: newTo });
  }
}
