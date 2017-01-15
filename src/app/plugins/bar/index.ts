import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MODULES } from 'app/plugging';
import { BarComponent } from './bar.component';
import { PlaybackControlsComponent } from './playbackControls';
import { TrackIndicatorComponent } from './trackIndicator';
import { VolumeControlComponent } from './volumeControl';
import { Commands } from './commands';
import { CoreModule } from 'app/core.module';

@NgModule({
  declarations: [
    BarComponent,
    PlaybackControlsComponent,
    TrackIndicatorComponent,
    VolumeControlComponent,
  ],
  imports: [CommonModule, CoreModule],
  exports: [BarComponent],
  providers: [Commands],
})
class BarModule { }

MODULES.push(BarModule);
