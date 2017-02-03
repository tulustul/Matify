export * from './playbackControls.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MODULES, BAR_COMPONENTS } from 'core/plugging';
import { CoreModule } from 'core/core.module';

import { PlaybackControlsComponent } from './playbackControls.component';
import { Commands } from './commands';

@NgModule({
  declarations: [
    PlaybackControlsComponent,
  ],
  exports: [PlaybackControlsComponent],
  entryComponents: [PlaybackControlsComponent],
  imports: [CommonModule, CoreModule],
  providers: [Commands],
})
class PlaybackControlsModule { }

MODULES.push(PlaybackControlsModule);
BAR_COMPONENTS.push(PlaybackControlsComponent);
