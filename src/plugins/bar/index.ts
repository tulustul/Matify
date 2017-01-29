import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MODULES } from 'core/plugging';
import { CoreModule } from 'core/core.module';

import { BarComponent } from './bar.component';
import { PlaybackControlsComponent } from './playbackControls';
import { TrackIndicatorComponent } from './trackIndicator';
import { SourceIndicatorComponent } from './sourceIndicator';
import { VolumeControlComponent } from './volumeControl';
import { Commands } from './commands';

@NgModule({
  declarations: [
    BarComponent,
    PlaybackControlsComponent,
    TrackIndicatorComponent,
    VolumeControlComponent,
    SourceIndicatorComponent,
  ],
  imports: [CommonModule, CoreModule],
  exports: [BarComponent],
  providers: [Commands],
})
class BarModule { }

MODULES.push(BarModule);
