import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { SettingForm } from './';

@Component({
  selector: 'mp-settings-input',
  template: '<input type="text" [formControl]="formControl">',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsInputComponent implements SettingForm {

  @Input()
  formControl: FormControl;

}
