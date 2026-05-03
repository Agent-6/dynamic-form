import { ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';
import { FormFieldComponent } from '../form/form-field/form-field.component';
import {
  FormFieldControl,
  FormFieldStateService,
} from '../form/form-field/form-field-control.component';

@Component({
  selector: 'ui-upload',
  templateUrl: './upload.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [FormFieldComponent],
  providers: [FormFieldStateService],
})
export class UploadComponent extends FormFieldControl<File | null> {
  public readonly accept = input<string>('');
  public readonly maxSize = input<number>(0);

  protected onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.value.set(input.files[0]);
    }
  }

  protected removeFile() {
    this.value.set(null);
  }

  protected formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
