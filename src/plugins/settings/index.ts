import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Plugin } from 'core/plugging';
import { CoreModule } from 'core/core.module';

import { FORM_COMPONENTS } from './forms';
import { SettingsComponent } from './settings.component';
import { SettingFormComponent } from './settingForm.component';

@Plugin({
  menuItems: [{
    icon: 'settings',
    name: 'Settings',
    component: SettingsComponent,
  }],
})
@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    SettingsComponent,
    SettingFormComponent,
    FORM_COMPONENTS,
  ],
  entryComponents: [
    SettingsComponent,
    FORM_COMPONENTS,
  ],
})
export class Module { }
