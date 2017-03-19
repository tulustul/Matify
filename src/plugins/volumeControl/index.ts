export * from './volumeControl.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Plugin } from 'core/plugging';
import { CoreModule } from 'core/core.module';

import { VolumeControlComponent } from './volumeControl.component';
import { Commands } from './commands';

@Plugin({
  barComponents: [VolumeControlComponent],
})
@NgModule({
  declarations: [
    VolumeControlComponent,
  ],
  exports: [VolumeControlComponent],
  entryComponents: [VolumeControlComponent],
  imports: [CommonModule, CoreModule],
  providers: [Commands],
})
class Module { }
