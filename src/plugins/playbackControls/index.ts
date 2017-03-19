export * from './playbackControls.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Plugin } from 'core/plugging';
import { CoreModule } from 'core/core.module';

import { PlaybackControlsComponent } from './playbackControls.component';
import { Commands } from './commands';

@Plugin({
  barComponents: [PlaybackControlsComponent],
})
@NgModule({
  declarations: [
    PlaybackControlsComponent,
  ],
  exports: [PlaybackControlsComponent],
  entryComponents: [PlaybackControlsComponent],
  imports: [CommonModule, CoreModule],
  providers: [Commands],
})
class Module { }
