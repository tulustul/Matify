import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { SettingForm } from './';

@Component({
  selector: 'mp-settings-password',
  template: '<input type="password" [formControl]="formControl">',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPasswordComponent implements SettingForm {

  @Input()
  formControl: FormControl;

}
