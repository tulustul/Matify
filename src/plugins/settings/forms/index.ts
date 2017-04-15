import { FormControl } from '@angular/forms';

import { SettingsInputComponent } from './input.component';
import { SettingsPasswordComponent } from './password.component';

export const FORM_COMPONENTS = [
  SettingsInputComponent,
  SettingsPasswordComponent,
];

export const FORMS_REGISTRY = {
  input: SettingsInputComponent,
  password: SettingsPasswordComponent,
};

export interface SettingForm {
  formControl: FormControl,
};
