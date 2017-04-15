import { FormControl } from '@angular/forms';

import { SettingsInputComponent } from './input.component';
import { SettingsPasswordComponent } from './password.component';
import { SettingsCheckboxComponent } from './checkbox.component';

export const FORM_COMPONENTS = [
  SettingsInputComponent,
  SettingsPasswordComponent,
  SettingsCheckboxComponent,
];

export const FORMS_REGISTRY = {
  input: SettingsInputComponent,
  password: SettingsPasswordComponent,
  checkbox: SettingsCheckboxComponent,
};

export interface SettingForm {
  formControl: FormControl,
};
