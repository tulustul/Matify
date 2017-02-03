export * from './volumeControl.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MODULES, BAR_COMPONENTS } from 'core/plugging';
import { CoreModule } from 'core/core.module';

import { VolumeControlComponent } from './volumeControl.component';
import { Commands } from './commands';

@NgModule({
  declarations: [
    VolumeControlComponent,
  ],
  exports: [VolumeControlComponent],
  entryComponents: [VolumeControlComponent],
  imports: [CommonModule, CoreModule],
  providers: [Commands],
})
class VolumeModule { }

MODULES.push(VolumeModule);
BAR_COMPONENTS.push(VolumeControlComponent);
