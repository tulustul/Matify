import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { SettingForm } from './';

@Component({
  selector: 'mp-settings-checkbox',
  template: '<input type="checkbox" [formControl]="formControl">',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsCheckboxComponent implements SettingForm {

  @Input()
  formControl: FormControl;

}
